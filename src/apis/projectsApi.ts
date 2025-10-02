import { GptzatorClient } from '../client';
import { TProjectDTO, TProjectsDTO, TArtefact } from '../types/projects';
import {ApiError} from "../errors/ApiError";
import {apiCall} from "../utils/apiCall";
import qs from 'qs';

/**
 * Класс для работы с проектами
 */
export class ProjectsApi {
  constructor(private readonly client: GptzatorClient) {}

  /**
   * Получение списка проектов с фильтром и пагинацией
   * @param params Параметры запроса
   * @returns {Promise<TProjectsDTO>}
   * @throws {ApiError}
   */
  async getProjects(params?: { search?: string; page: number }): Promise<TProjectsDTO> {
    return apiCall("ProjectsApi.getProjects", async () => {
      const query: any = params?.search
              ? { where: { name: { contains: params.search } } }
              : undefined;
      const { data } = await this.client.http.get<TProjectsDTO>('/projects', {
        params: { ...query, limit: 20, page: params?.page },
      });
      return data;
    });
  }

  /**
   * Получение проектов конкретного приложения
   * @param appId ID приложения
   * @returns {Promise<TProjectsDTO>}
   * @throws {ApiError}
   */
  async getAppProjects(appId: string): Promise<TProjectsDTO> {
    return apiCall("ProjectsApi.getAppProjects", async () => {
      const stringified = qs.stringify({ depth: 0, where: { application: { equals: appId } } }, { addQueryPrefix: true });
      const { data } = await this.client.http.get<TProjectsDTO>(`/projects${stringified}`);
      return data;
    });
  }

  /**
   * Получение проекта по ID
   * @param id ID проекта
   * @returns {Promise<TProjectDTO>}
   * @throws {ApiError}
   */
  async getProject(id: string): Promise<TProjectDTO> {
    return apiCall("ProjectsApi.getProject", async () => {
      const { data } = await this.client.http.get<TProjectDTO>(`/projects/${id}`);
      return data;
    });
  }

  /**
   * Создание нового проекта
   * @param params Объект с idea, applicationId, isDemo?, isTest?
   * @returns {Promise<TProjectDTO>}
   * @throws {ApiError}
   */
  async createProject(params: {
    idea: string;
    applicationId: string;
    isDemo?: boolean;
    isTest?: boolean;
  }): Promise<TProjectDTO> {
    return apiCall("ProjectsApi.createProject", async () => {
      const body: any = { name: params.idea, idea: params.idea, application: params.applicationId };
      if (params.isDemo) body.isDemo = params.isDemo;
      if (params.isTest) body.isTest = params.isTest;
      const { data } = await this.client.http.post<{ doc: TProjectDTO }>(`/projects/`, body);
      return data.doc;
    });
  }

  /**
   * Обновление действий проекта
   * @param projectId ID проекта
   * @param data Данные для обновления
   * @returns {Promise<TProjectDTO>}
   * @throws {ApiError}
   */
  async updateProjectActions(projectId: string, data: any): Promise<TProjectDTO> {
    return apiCall("ProjectsApi.updateProjectActions", async () => {
      const { data: project } = await this.client.http.patch<{ doc: TProjectDTO }>(`/projects/${projectId}`, data);
      return project.doc;
    });
  }

  /**
   * Генерация артефактов проекта
   * @param projectId ID проекта
   * @param hasBlocks Флаг наличия шагов
   * @returns {Promise<TArtefact<any>[]>}
   * @throws {ApiError}
   */
  async generateArtefact(projectId: string, hasBlocks: boolean): Promise<TArtefact<any>[]> {
    return apiCall("ProjectsApi.generateArtefact", async () => {
      const path = `/projects/${projectId}/generate${hasBlocks ? "Blocks" : ""}`;
      const { data } = await this.client.http.post<TArtefact<any>[]>(path);
      return data;
    });
  }

  /**
   * Регенерация артефакта проекта
   * @param projectId ID проекта
   * @param artefactId ID артефакта
   * @param comment Комментарий к регенерации
   * @returns {Promise<TArtefact<any>[]>}
   * @throws {ApiError}
   */
  async regenerateArtefact(
    projectId: string,
    artefactId: string,
    comment?: string,
  ): Promise<TArtefact<any>[]> {
    return apiCall("ProjectsApi.regenerateArtefact", async () => {
      const { data } = await this.client.http.post<TArtefact<any>[]>(`/projects/${projectId}/regenerate/${artefactId}`, { comment });
      return data;
    });
  }

  /**
   * Удаление проекта
   * @param id ID проекта
   * @throws {ApiError}
   */
  async deleteProject(id: string): Promise<void> {
    return apiCall("ProjectsApi.deleteProject", async () => {
      const stringified = qs.stringify({ depth: 0, where: { id: { equals: id } } }, { addQueryPrefix: true });
      await this.client.http.delete(`/projects${stringified}`);
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
   * @returns {Promise<TProjectDTO>}
   * @throws {ApiError}
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

    // Оборачиваем весь процесс в apiCall для единообразного контекста
    return apiCall("ProjectsApi.callApp", async () => {
      // 1) Создание проекта (createProject уже обёрнут в apiCall)
      const project = await this.createProject({ idea, applicationId, ...(isDemo !== undefined ? { isDemo } : {}), ...(isTest !== undefined ? { isTest } : {}) });

      // 2) Запуск генерации
      await this.generateArtefact(project.id, hasBlocks);

      // 3) Ожидание завершения с polling
      const start = Date.now();
      const isGenerating = (p: TProjectDTO) => Boolean((p as any).generating);

      let current: TProjectDTO = project;
      while (true) {
        if (Date.now() - start > timeoutMs) {
          throw new ApiError("Превышено время ожидания генерации проекта");
        }

        current = await this.getProject(current.id);

        // Бизнес-ошибки, которые приходят в проекте
        if ((current as any).lastGenerationError) {
          throw new ApiError(`Ошибка генерации: ${(current as any).lastGenerationError}`);
        }

        if ((current as any).error) {
          throw new ApiError(`Ошибка проекта: ${JSON.stringify((current as any).error)}`);
        }

        if (!isGenerating(current)) {
          return current;
        }

        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      }
    });
  }
}
