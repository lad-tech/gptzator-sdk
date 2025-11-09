# GPTZATOR SDK

**Кратко:** этот SDK — набор TypeScript-классов для удобной работы с REST API платформы GPTZATOR.  
README служит документацией для пользователя пакета.

---

## <a id="contents"></a>Содержание

- [Введение](#introduction)
- [Установка и настройка](#install-and-config)
- [Быстрый старт](#quick-start)
- [Аутентификация](#authentication)
- [Подробное описание модулей и их методов](#apis-description)
    - [UserApi](#userapi)
    - [AppsApi](#appsapi)
    - [ProjectsApi](#projectsapi)
    - [ThreadsApi](#threadsapi)
    - [AssistantsApi](#assistantsapi)
    - [ApiTemplatesApi](#apitemplatesapi)
    - [FilesApi](#filesapi)
    - [ModelsApi](#modelsapi)
    - [InvitesApi](#invitesapi)
    - [SourcesApi](#sourcesapi)
    - [SubscribesApi](#subscribesapi)
    - [ThreadAssistantApi](#threadassistantapi)
    - [VaultsApi](#vaultsapi)
    - [WorkspacesApi](#workspacesapi)


## <a id="introduction"></a>Введение
Gptzator API SDK — это официальная клиентская библиотека для взаимодействия с 
платформой Gptzator AI. 
Библиотека предоставляет удобный интерфейс для работы 
со всеми возможностями платформы через JavaScript/TypeScript, 
включая управление ассистентами, проектами, 
файлами и другими сущностями платформы.


## <a id="install-and-config"></a>Установка и настройка

### Установка

```bash
npm install @lad-tech/gptzator-sdk
# или
yarn add @lad-tech/gptzator-sdk
```

## <a id="quick-start"></a>Быстрый старт

## <a id="authentication"></a>Аутентификация

### Подход в SDK (JWT)
В этом SDK авторизация реализована через **JWT-токены**, которые прокидываются в заголовок `Authorization: Bearer <token>`.  
Для этого в `GptzatorClient` предусмотрены методы управления токенами:

- Aвтоматическое сохранение token внутри инстанса client при вызове loginUser или signupUser внутри
  [UserApi](#userapi)

```ts
import { GptzatorClient } from "@lad-tech/gptzator-sdk";

const client = new GptzatorClient("https://your-api.com");

// автоматическое сохранение token внутри инстанса cleint при вызове
client.user.loginUser("email", "password")
        
// или
client.user.signupUser("email", "password", "policy", "phone")
```

- Или установка токенов через setTokens

```ts
import { GptzatorClient } from "@lad-tech/gptzator-sdk";

const client = new GptzatorClient("https://your-api.com");

// Сохранить токены (например, после логина)
client.setTokens({
  accessToken: "ACCESS_TOKEN",
  refreshToken: "REFRESH_TOKEN", // опционально
});

// Очистить токены (например, при logout)
client.clearTokens();
```

После сохранения token одним из указанных способов все запросы автоматически будут содержать заголовок:
```ts
Authorization: `Bearer ACCESS_TOKEN`
```

При инициализации инстанса client можно изменить место хранения токена(например, на localStorage).
Для этого необходимо использовать параметр tokenStorage
```ts
import { GptzatorClient } from "@lad-tech/gptzator-sdk";

const client = new GptzatorClient("https://your-api.com", tokenStorage); // type TokenStorage
```

## <a id="apis-description"></a>Подробное описание модулей и их методов
Описание классов API, методам, параметрам, возвращаемым значениям и возможным ошибкам.  
Все методы используют единый стиль обработки ошибок через `apiCall(fn, context)` и выбрасывают `ApiError`.

### <a id="userapi"></a>1. UserApi

Работа с пользователями.

- **`getUser(): Promise<TUser>`**  
  Получить данные текущего пользователя.  
  @throws `ApiError` при сетевых ошибках или недоступности сервера.

- **`loginUser(email: string, password: string): Promise<{ user: TUser, token: string, refreshToken?: string }>`**  
  Авторизация пользователя. Устанавливает токены в клиент.  
  @throws `ApiError` при неверных данных или отсутствии токена.

- **`signupUser(params): Promise<{ user: TUser, token: string, refreshToken?: string }>`**
  где `params: { email: string; password: string; policy: boolean; phone: string; promoCode?: string; organizationInviteToken?: string; }`
  Регистрация нового пользователя.  
  @throws `ApiError` при сетевой ошибке или отсутствии токена в ответе.

- **`signupDemoUser(): Promise<TUser>`**  
  Регистрация демо-пользователя.  
  @throws `ApiError` при ошибках сети.

- **`logoutUser(): Promise<void>`**  
  Выход из системы и сброс токенов.  
  @throws `ApiError` при сетевой ошибке.

- **`changePassword(oldPassword, newPassword): Promise<any>`**  
  Смена пароля.  
  @throws `ApiError` при сетевой ошибке или неверных данных.

- **`forgotPassword(email: string): Promise<any>`**  
  Запрос на восстановление пароля.  
  @throws `ApiError` при сетевой ошибке или неверных данных.

- **`resetPassword(token: string, password: string): Promise<TUser>`**  
  Сброс пароля по токену.  
  @throws `ApiError` при сетевой ошибке или неверном токене.

- **`updateDefaultThreadModel(userId, modelId): Promise<TUser>`**  
  Обновление модели чата по умолчанию.  
  @throws `ApiError` при сетевой ошибке или неверных данных.

- **`setOnboarded(userId, pageName): Promise<TUser>`**  
  Пометить страницу онбординга пройденной.  
  @throws `ApiError` при сетевой ошибке.

- **`uploadAvatar(formData: FormData): Promise<TUserAvatar>`**  
  Загрузка аватара.  
  @throws `ApiError` при ошибках загрузки или сети.

- **`deleteAvatar(fileId: string): Promise<any>`**  
  Удаление аватара.  
  @throws `ApiError` при сетевой ошибке.

- **`updateFirstAndMiddleName(userId: string, firstName: string, lastName: string): Promise<TUser>`**  
  Обновление имени и фамилии.  
  @throws `ApiError` при сетевой ошибке.

- **`setLocale(locale: string): Promise<void>`**  
  Установка локали.  
  @throws `ApiError` при сетевой ошибке.

---
[К содержанию](#contents)

### <a id="appsapi"></a>2. AppsApi

Работа с приложениями.

- **`getApps(): Promise<TAppsDTO>`**  
  Список приложений.    
  @throws `ApiError` при сетевой ошибке.

- **`getAppById(id: string): Promise<TApp>`**  
  Приложение по ID.  
  @throws `ApiError` при сетевой ошибке.

- **`createApp(author: string, name: string): Promise<TApp>`**  
  Создание нового приложения.   
  @throws `ApiError` при сетевой ошибке или неверных данных.

- **`updateApp(id: string, data: any): Promise<TApp>`**  
  Обновление приложения.  
  @throws `ApiError` при сетевой ошибке или неверных данных для обновления.

- **`deleteApp(id: string): Promise<TAppsDTO>`**  
  Удаление приложения.  
  @throws `ApiError` при сетевой ошибке.

- **`getAppById(id: string): Promise<TApp>`**  
  Получение приложения по ID.  
  @throws `ApiError` при сетевой ошибке.

- **`getOauthClients(redirectUri: string): Promise<TOauthClient[]>`**  
  Получение OAuth клиентов для приложения.  
  @throws `ApiError` при сетевой ошибке.

- **`logoutOauthClient(clientId: string): Promise<void>`**  
  Логаут OAuth клиента.  
  @throws `ApiError` при сетевой ошибке или неверном clientId.

- **`getAppsMenu(): Promise<TAppsMenu[]>`**  
  Получение меню навыков.  
  @throws `ApiError` при сетевой ошибке.

- **`getFavouriteApps(): Promise<TApp[]>`**  
  Получение избранных навыков.  
  @throws `ApiError` при сетевой ошибке.

- **`updateIsFavourite(id: string, isFavourite: boolean): Promise<void>`**  
  Обновление статуса избранного навыка.  
  @throws `ApiError` при сетевой ошибке или неверном id навыка.

- **`getTags(limit: number): Promise<TTagsDTO>`**  
  Получение тегов приложений.  
  @throws `ApiError` при сетевой ошибке.

- **`getSettingsTemplates(limit: number): Promise<TSettingsTemplateDTO>`**  
  Получение шаблонов настроек приложения.  
  @throws `ApiError` при сетевой ошибке.

- **`activateTemplate(id: string): Promise<TSettingsTemplate>`**  
  Активация шаблона настроек.  
  @throws `ApiError` при сетевой ошибке или неверном id шаблона.

- **`createSettingsTemplate(data: { app: string; name: string; values?: Record<string, any>; isDefault: boolean; isPrivate: boolean; isActive: boolean;}): Promise<TSettingsTemplate>`**  
  Создание шаблона настроек.  
  @throws `ApiError` при сетевой ошибке или неверные данные для создания шаблона.

- **`updateSettingsTemplate(id: string, data: any): Promise<TSettingsTemplate>`**  
  Обновление шаблона настроек.  
  @throws `ApiError` при сетевой ошибке или неверные данные для редактрирования шаблона.

- **`deleteSettingsTemplate(id: string): Promise<void>`**  
  Удаление шаблона настроек.  
  @throws `ApiError` при сетевой ошибке или неверном id шаблона.

---
[К содержанию](#contents)

### <a id="projectsapi"></a>3. ProjectsApi

Работа с проектами.

- **`getProjects(params?: { search?: string; page: number }): Promise<TProjectsDTO>`**  
  Получение списка проектов с фильтром и пагинацией.  
  @throws `ApiError`.

- **`getAppProjects(appId: string): Promise<TProjectsDTO>`**  
  Получение проектов конкретного навыка.  
  @throws `ApiError`.

- **`getProject(id: string): Promise<TProjectDTO>`**  
  Получение проекта по ID.  
  @throws `ApiError`.

- **`createProject(params: { idea: string; applicationId: string; isDemo?: boolean; isTest?: boolean;  }): Promise<TProjectDTO>`**  
  Создание нового проекта.  
  @throws `ApiError`.

- **`updateProjectActions(projectId: string, data: any): Promise<TProjectDTO>`**  
  Обновление действий проекта.  
  @throws `ApiError`.

- **`generateArtefact(projectId: string, hasBlocks: boolean): Promise<TArtefact<any>[]>`**  
  Генерация артефактов проекта.  
  @throws `ApiError`.

- **`regenerateArtefact( projectId: string, artefactId: string, comment?: string ): Promise<TArtefact<any>[]>`**  
  Регенерация артефакта проекта.  
  @throws `ApiError`.

- **`deleteProject(id: string): Promise<void>`**  
  Удаление проекта.  
  @throws `ApiError`.

- **`callApp(applicationId: string, idea: string, options?: {hasBlocks?: boolean; pollIntervalMs?: number; timeoutMs?: number; isDemo?: boolean; isTest?: boolean}): Promise<TProjectDTO>`**  
  Полный цикл создания проекта и генерации артефактов через ассистента.  
  Использует `apiCall` + `handleApiError` внутри `createProject`, `generateArtefact` и `getProject`.  
  @throws `ApiError` при:
  - Ошибках создания проекта
  - Ошибках генерации артефактов
  - Ошибках получения проекта
  - Превышении таймаута
  - Наличии `lastGenerationError` или `project.error`

---
[К содержанию](#contents)

### <a id="threadsapi"></a>4. ThreadsApi

Работа с тредами (чатами).

- **`getThreads(params?: TThreadsSearchParams): Promise<TThreadsDTO>`**  
  Получить список тредов с пагинацией и поиском.  
  @throws `ApiError`.

- **`getThreadById(id: string): Promise<TThreadDTO>`**  
  Получить тред по его идентификатору.  
  @throws `ApiError`.

- **`createThread(data: { id: string; title: string; vaultIds?: string[]; fileIds?: string[] }): Promise<TThreadDTO>`**  
  Создать новый тред.  
  @throws `ApiError`.

- **`deleteThread(id: string): Promise<TThreadDTO>`**  
  Удалить тред.  
  @throws `ApiError`.

- **`updateThreadVault(data: { id: string; vaultIds: string[] }): Promise<TThreadDTO>`**  
  Обновить список хранилищ (vaults), привязанных к треду.  
  @throws `ApiError`.

- **`getMessages(params: { threadId: string; page?: number }): Promise<TMessagesDTO>`**  
  Получить список сообщений в треде.  
  @throws `ApiError`.

- **`getGenerationTypes(): Promise<TGenerationTypeDTO>`**  
  Получить список типов генерации.  
  @throws `ApiError`.

- **`updateGenerationType(data: { threadId: string; typeId: string }): Promise<TThreadDTO>`**  
  Обновить тип генерации для треда.  
  @throws `ApiError`.

- **`updateThreadModel(data: { threadId: string; modelId: string }): Promise<TThreadDTO>`**  
  Обновить модель для треда.  
  @throws `ApiError`.

- **`createMessage(data: { text: string; threadId: string }): Promise<TMessage>`**  
  Создать сообщение в треде.  
  @throws `ApiError`.

- **`editMessage(data: { content: string; messageId: string; threadId: string }): Promise<TMessage>`**  
  Изменить сообщение в треде.  
  @throws `ApiError`.

- **`deleteMessage(data: { messageId: string; threadId: string }): Promise<TMessage>`**  
  Удалить сообщение из треда.  
  @throws `ApiError`.

- **`regenerateMessage(data: { messageId: string; threadId: string }): Promise<TMessage>`**  
  Перегенерировать сообщение.  
  @throws `ApiError`.

- **`attachFilesToThread(data: { threadId: string; fileIds: string[] }): Promise<TMessage>`**  
  Прикрепить файлы к треду.  
  @throws `ApiError`.

---
[К содержанию](#contents)

### <a id="assistantsapi"></a>5. AssistantsApi

Работа с ассистентами.

- **`getAssistants(search?: string): Promise<{ assistants: TAssistant[] }>`**  
  Получение списка ассистентов  
  @throws `ApiError`.

- **`getAssistantById(id: string): Promise<TAssistant>`**  
  Создание ассистента  
  @throws `ApiError`.

- **`createAssistant(data: TCreateAssistantRequest): Promise<TAssistant>`**  
  Получение ассистента по ID  
  @throws `ApiError`.

- **`updateAssistant(id: string, data: TCreateAssistantRequest): Promise<TAssistant>`**  
  Обновление ассистента  
  @throws `ApiError`.

- **`updateAssistantContext(id: string, data: TUpdateAssistantContextRequest): Promise<TAssistant>`**  
  Обновление контекста ассистента  
  @throws `ApiError`.

- **`uploadAssistantImage(formData: FormData): Promise<any>`**  
  Загрузка изображения ассистента  
  @throws `ApiError`.

- **`deleteAssistant(id: string): Promise<TAssistant>`**  
  Удаление ассистента  
  @throws `ApiError`.

---
[К содержанию](#contents)

### <a id="apitemplatesapi"></a>6. ApiTemplatesApi

Работа с шаблонами API.

- **`getApiTemplates(params: { search?: string; page: number; vaultsPerPage?: number }): Promise<TApiTemplatesDTO>`**  
  Получение списка API-шаблонов  
  @throws `ApiError`.

- **`getApiTemplate(id: string): Promise<TApiTemplate>`**  
  Получение API-шаблона по ID
  @throws `ApiError`.

- **`getApiTemplate(id: string): Promise<TApiTemplate>`**  
  Получение API-шаблона по ID
  @throws `ApiError`.

---
[К содержанию](#contents)

### <a id="filesapi"></a>7. FilesApi

Работа с файлами.

- **`uploadFile(formData: FormData): Promise<any>`**  
  Загрузка файла.  
  @throws `ApiError`.

- **`getFile(id: string): Promise<TFile>`**  
  Получение файла по ID  
  @throws `ApiError`.

- **`getFilesByIds(ids: string[]): Promise<TFileDTO>`**  
  Получение списка файлов по ID  
  @throws `ApiError`.

- **`deleteFile(fileId: string): Promise<any>`**  
  Удаление файла  
  @throws `ApiError`.

- **`uploadThreadFile(formData: FormData): Promise<any>`**  
  Загрузка файла для треда  
  @throws `ApiError`.

- **`deleteThreadFile(fileId: string): Promise<any>`**  
  Удаление файла из треда  
  @throws `ApiError`.

---
[К содержанию](#contents)

### <a id="modelsapi"></a>8. ModelsApi

Работа с моделями.

- **`getModels(): Promise<TModel[]>`**  
  Получение списка моделей  
  @throws `ApiError`.

- **`getActiveModels(): Promise<TModel[]>`**  
  Получение списка активных моделей  
  @throws `ApiError`.

- **`getLlmModels(): Promise<TLlmModel[]>`**  
  Получение списка LLM моделей  
  @throws `ApiError`.

- **`getEmbeddingModels(): Promise<TEmbeddingModel[]>`**  
  Получение embedding-моделей  
  @throws `ApiError`.

---
[К содержанию](#contents)

### <a id="invitesapi"></a>9. InvitesApi

Работа с инвайтами.

- **`getInvitesList(params: { search?: string; page: number; invitesPerPage?: number }): Promise<TInvitesDTO>`**  
  Получение списка приглашений  
  @throws `ApiError`.

- **`getInvite( organizationInviteToken: string ): Promise<Pick<TInvite, 'organization' | 'email'>>`**  
  Получение конкретного приглашения по токену  
  @throws `ApiError`.

- **`createInvite(email: string): Promise<TInvite>`**  
  Создание приглашения  
  @throws `ApiError`.

- **`deleteInvite(inviteId: string): Promise<TInvite>`**  
  Удаление приглашения  
  @throws `ApiError`.

---
[К содержанию](#contents)

### <a id="sourcesapi"></a>10. SourcesApi

Работа с источниками данных.

- **`getSources(params: { ids?: string[]; search?: string }): Promise<TSourcesDTO>`**  
  Получение списка источников  
  @throws `ApiError`.

- **`uploadFileSource(formData: FormData): Promise<TFileSource>`**  
  Загрузка файла источника  
  @throws `ApiError`.

- **`createSource(params: { workspaceId: string; fileId: string; parentSpaceId?: string }): Promise<any>`**  
  Создание источника в рабочем пространстве  
  @throws `ApiError`.

- **`updateSource(params: { id: string; name: string; sesctiption?: string }): Promise<{ doc: TSourceDTO }>`**  
  Обновление источника  
  @throws `ApiError`.

- **`deleteSource(params: { workspaceId: string; sourceId: string }): Promise<any>`**  
  Удаление источника  
  @throws `ApiError`.

---
[К содержанию](#contents)

### <a id="subscribesapi"></a>11. SubscribesApi

Работа с подписками.

- **`getSubscribes(): Promise<TSubscribeDTO>`**  
  Получение списка подписок  
  @throws `ApiError`.

- **`getProducts(): Promise<TProductDTO>`**  
  Получение списка продуктов  
  @throws `ApiError`.

- **`getSubscribeUrl( subscribeId: string ): Promise<{ uri: string }>`**  
  Получение ссылки для подписки  
  @throws `ApiError`.

- **`applyCoupon(params: { couponCode: string }): Promise<{ message?: string }>`**  
  Применение купона  
  @throws `ApiError`.

---
[К содержанию](#contents)

### <a id="threadassistantapi"></a>12. ThreadAssistantApi

Работа с ассистентами в тредах.

- **`getThreadsByWorkspaceId(params: { id: string; page: number; search?: string }): Promise<TThreadsAssistantDTO>`**  
  Получение тредов по workspaceId  
  @throws `ApiError`.

- **`getThreadsByAssistantId(params: { id: string; page: number; search?: string }): Promise<TThreadsAssistantDTO>`**  
  Получение тредов по assistantId  
  @throws `ApiError`.

- **`createThreadByWorkspaceId(params: { id: string; title: string }): Promise<TThreadAssistantDTO>`**  
  Создание треда в workspace  
  @throws `ApiError`.

- **`createThreadByAssistantId(params: { id: string; title: string; modeId?: string }): Promise<TThreadAssistantDTO>`**  
  Создание треда для ассистента  
  @throws `ApiError`.

- **`updateThreadAssistant( thread: TThreadAssistantDTO ): Promise<TThreadAssistantDTO>`**  
  Обновление треда ассистента  
  @throws `ApiError`.

- **`getThreadAssistantById(id: string): Promise<TThreadAssistantDTO>`**  
  Получение треда по ID  
  @throws `ApiError`.

- **`getMessagesAssistant( params: TMessagesSearchParams ): Promise<IGetMessagesResponse>`**  
  Получение сообщений ассистента  
  @throws `ApiError`.

- **`createMessageAssistant(params: { text: string; threadId: string }): Promise<TMessage>`**  
  Создание сообщения  
  @throws `ApiError`.

- **`editMessageAssistant(params: { threadId: string; messageId: string; content: string }): Promise<TMessage>`**  
  Редактирование сообщения  
  @throws `ApiError`.

- **`deleteMessageAssistant(params: { threadId: string; messageId: string }): Promise<TMessage>`**  
  Удаление сообщения  
  @throws `ApiError`.

- **`regenerateMessageAssistant(params: { threadId: string; messageId: string }): Promise<TMessage>`**  
  Регенерация сообщения  
  @throws `ApiError`.

- **`deleteThreadAssistant(params: { threadId: string }): Promise<TMessage>`**  
  Удаление треда  
  @throws `ApiError`.

- **`editThreadMode(id: string, modeId: string): Promise<any>`**  
  Редактирование режима треда  
  @throws `ApiError`.

- **`getThreadStream(threadId: string): EventSource`**  
  Получение EventSource для стриминга сообщений треда.  
  @throws `ApiError`.

---
[К содержанию](#contents)

### <a id="vaultsapi"></a>13. VaultsApi

Работа с хранилищами.

- **`getVaults(params: { tag?: string; search?: string; page: number; vaultsPerPage?: number }): Promise<TVaultsDTO>`**  
  Получение списка Vaults  
  @throws `ApiError`.

- **`getVault(id: string): Promise<TVault>`**  
  Получение Vault по ID  
  @throws `ApiError`.

- **`getVaultsByIds(ids: string[]): Promise<TVaultsDTO>`**  
  Получение Vaults по списку ID  
  @throws `ApiError`.

- **`getFavouriteVaults(): Promise<TVault[]>`**  
  Получение избранных Vaults пользователя  
  @throws `ApiError`.

- **`updateIsFavouriteVault(params: { id: string; isFavourite: boolean }): Promise<void>`**  
  Добавление/удаление Vault из избранного  
  @throws `ApiError`.

- **`getVaultTags(): Promise<TVaultTagsDTO>`**  
  Получение тегов Vaults  
  @throws `ApiError`.

- **`createVault(data: TCreateVaultForm): Promise<TVault>`**  
  Создание Vault  
  @throws `ApiError`.

- **`editVault(data: TCreateVaultForm): Promise<TVault>`**  
  Редактирование Vault  
  @throws `ApiError`.

- **`deleteVault(id: string): Promise<TVaultsDTO>`**  
  Удаление Vault  
  @throws `ApiError`.

---
[К содержанию](#contents)

### <a id="workspacesapi"></a>14. WorkspacesApi

Работа с рабочими пространствами.

- **`getWorkspaces(params?: { search?: string }): Promise<{ workspaces: TWorkspace[] }>`**  
  Получить список рабочих пространств  
  @throws `ApiError`.

- **`createWorkspace(data: { name: string; description?: string; instructions?: string }): Promise<TWorkspace>`**  
  Создать рабочее пространство  
  @throws `ApiError`.

- **`updateWorkspace( id: string, data: { name: string; description: string; instructions?: string }): Promise<TWorkspace>`**  
  Обновить рабочее пространство  
  @throws `ApiError`.

- **`deleteWorkspace(id: string): Promise<TWorkspace>`**  
  Удалить рабочее пространство  
  @throws `ApiError`.

- **`getWorkspaceById(id: string): Promise<TWorkspace>`**  
  Получить рабочее пространство по ID  
  @throws `ApiError`.

- **`getWorkspaceSourcesTree(id: string): Promise<TWorkspaceTree>`**  
  Получить дерево источников и вложенных пространств  
  @throws `ApiError`.

[К содержанию](#contents)





