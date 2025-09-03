import { GptzatorClient } from '../client';
import { TProjectDTO, TProjectsDTO, TArtefact } from '../types/projects';
import {ApiError} from "../errors/ApiError";

/**
 * Класс для работы с проектами
 */
export class ProjectsApi {
  constructor(private readonly client: GptzatorClient) {}

  /**
   * Получение списка проектов с фильтром и пагинацией
   * @param params Параметры запроса
   * @returns {Promise<TProjectsDTO>} Объект с параметрами пагинации и списком проектов
   */
  async getProjects(params?: { search?: string; page: number }): Promise<TProjectsDTO> {
    const query: any = params?.search
      ? { where: { name: { contains: params.search } } }
      : undefined;
    const { data } = await this.client.http.get<TProjectsDTO>('/projects', {
      params: { ...query, limit: 20, page: params?.page },
    });
    return data;
  }

  /**
   * Получение проектов конкретного приложения
   * @param appId ID приложения
   * @returns {Promise<TProjectsDTO>} Объект с параметрами пагинации и списком проектов
   */
  async getAppProjects(appId: string): Promise<TProjectsDTO> {
    const { data } = await this.client.http.get<TProjectsDTO>('/projects', {
      params: { where: { application: { equals: appId } }, depth: 0 },
    });
    return data;
  }

  /**
   * Получение проекта по ID
   * @param id ID проекта
   */
  async getProject(id: string): Promise<TProjectDTO> {
    const { data } = await this.client.http.get<TProjectDTO>(`/projects/${id}`);
    return data;
  }

  /**
   * Создание нового проекта
   * @param idea Идея проекта
   * @param applicationId ID приложения
   * @param isDemo Флаг демо-проекта
   * @param isTest Флаг тестового проекта
   * @returns {Promise<TProjectDTO>} Объект проекта
   */
  async createProject(params: {
    idea: string;
    applicationId: string;
    isDemo?: boolean;
    isTest?: boolean;
  }): Promise<TProjectDTO> {
    const { data } = await this.client.http.post<{ doc: TProjectDTO }>('/projects/', {
      name: params.idea,
      idea: params.idea,
      application: params.applicationId,
      ...(params.isDemo ? { isDemo: params.isDemo } : {}),
      ...(params.isTest ? { isTest: params.isTest } : {}),
    });
    return data.doc;
  }

  /**
   * Обновление действий проекта
   * @param projectId ID проекта
   * @param data Данные для обновления
   * @returns {Promise<TProjectDTO>} Объект проекта
   */
  async updateProjectActions(projectId: string, data: any): Promise<TProjectDTO> {
    const { data: project } = await this.client.http.patch<{ doc: TProjectDTO }>(
      `/projects/${projectId}`,
      data,
    );
    return project.doc;
  }

  /**
   * Генерация артефактов проекта
   * @param projectId ID проекта
   * @param hasBlocks Флаг наличия шагов
   */
  async generateArtefact(projectId: string, hasBlocks: boolean): Promise<TArtefact<any>[]> {
    const { data } = await this.client.http.post<TArtefact<any>[]>(
      `/projects/${projectId}/generate${hasBlocks ? 'Blocks' : ''}`,
    );
    return data;
  }

  /**
   * Регенерация артефакта проекта
   * @param projectId ID проекта
   * @param artefactId ID артефакта
   * @param comment Комментарий к регенерации
   */
  async regenerateArtefact(
    projectId: string,
    artefactId: string,
    comment?: string,
  ): Promise<TArtefact<any>[]> {
    const { data } = await this.client.http.post<TArtefact<any>[]>(
      `/projects/${projectId}/regenerate/${artefactId}`,
      { comment },
    );
    return data;
  }

  /**
   * Удаление проекта
   * @param id ID проекта
   */
  async deleteProject(id: string): Promise<void> {
    await this.client.http.delete('/projects', {
      params: { where: { id: { equals: id } }, depth: 0 },
    });
  }

  /**
   * Запускает ассистента и дожидается завершения проекта.
   * Предназначено для сценариев, где у всех шагов ассистента установлен `autonext: true`.
   *
   * Что делает внутри:
   * 1) Создаёт проект на базе ассистента (`createProject`).
   * 2) Запускает выполнение первого шага (`generateArtefact`).
   * 3) Периодически опрашивает состояние проекта (`getProject`) до тех пор, пока генерация не завершится.
   *
   * @param applicationId ID ассистента (приложения), на базе которого создаётся проект.
   * @param idea Текст запроса пользователя (идея проекта).
   * @param options Дополнительные опции.
   * @param options.hasBlocks Если `true`, первый запуск идёт через `/generateBlocks`, иначе через `/generate`. По умолчанию `true`.
   * @param options.pollIntervalMs Интервал опроса состояния проекта в миллисекундах. По умолчанию `2000`.
   * @param options.timeoutMs Таймаут ожидания завершения в миллисекундах. По умолчанию `300000` (5 минут).
   * @param options.isDemo Пробрасывается в `createProject` как флаг демо-проекта.
   * @param options.isTest Пробрасывается в `createProject` как флаг тестового проекта.
   * @returns {Promise<TProjectDTO>} Завершённый проект с заполненными артефактами.
   * @throws ApiError при сетевой ошибке или при наличии ошибок в самом проекте
   */
  async callApp(
          applicationId: string,
          idea: string,
          options: {
            hasBlocks?: boolean;
            pollIntervalMs?: number;
            timeoutMs?: number;
            isDemo?: boolean;
            isTest?: boolean;
          } = {}
  ): Promise<TProjectDTO> {
    const {
      hasBlocks = true,
      pollIntervalMs = 2000,
      timeoutMs = 5 * 60 * 1000,
      isDemo,
      isTest,
    } = options;
    let project;

    // 1) Создать проект
    try {
      project = await this.createProject({
        idea,
        applicationId,
        ...(isDemo !== undefined ? { isDemo } : {}),
        ...(isTest !== undefined ? { isTest } : {}),
      });
    } catch (err: any) {
      throw new ApiError("Ошибка при создании проекта", err);
    }

    // 2) Запустить первый шаг
    try {
      await this.generateArtefact(project?.id, hasBlocks);
    } catch (err: any) {
      throw new ApiError("Ошибка при запуске генерации", err);
    }

    // 3) Ожидание завершения (polling)
    const start = Date.now();
    const isGenerating = (project: TProjectDTO): boolean => Boolean(project.generating);

    // Первый опрос сразу после старта, далее — с интервалом
    while (true) {
      // таймаут
      if (Date.now() - start > timeoutMs) {
        throw new ApiError("Превышено время ожидания генерации проекта");
      }

      try {
        project = await this.getProject(project.id);
      } catch (err: any) {
        throw new ApiError("Ошибка при получении статуса проекта", err);
      }

      // проверка на бизнес-ошибки
      if (project.lastGenerationError) {
        throw new ApiError(
                `Ошибка генерации: ${project.lastGenerationError}`
        );
      }

      if (project.error) {
        throw new ApiError(
                `Ошибка проекта: ${JSON.stringify(project.error)}`
        );
      }

      if (!isGenerating(project)) {
        return project; // Готово: генерация завершена, артефакты внутри проекта
      }

      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
  }
}
