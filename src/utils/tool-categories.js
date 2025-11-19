// Centralized tool category patterns and helpers

export const patterns = {
  // Job Management
  "job:list":
    /^.*(?:getJob|listJobs|listCompletedJobs|listExtendedJobs|countJobs|countCompletedJobs|searchJobs|getCompletedJob|getCompletedCount|getCompletedJobResult|getCompletedJobResultMaybe|listFilteredJobsUuids|countJobsByTag).*$/i,
  "job:run":
    /^.*(?:runScript|runFlow|runWaitResult|runSlackMessageTest|runTeamsMessageTest).*$/i,
  "job:manage":
    /^.*(?:cancel|resume|forceCancel|batchReRun|setJobProgress|deleteCompletedJob|cancelPersistentQueuedJobs|getRootJobId|getConcurrencyKey|createJobSignature|getSuspendedJobFlow).*$/i,

  // User Management
  "user:auth":
    /^.*(?:login|logout|token|refreshToken|setPassword|blacklist).*$/i,
  "user:profile":
    /^.*(?:getUser|updateUser|whoami|whois|usernameToEmail|getCurrentEmail).*$/i,
  "user:admin":
    /^.*(?:addUser|createAccount|deleteUser|createUserGlobally|globalUser|setLoginTypeForUser|setPasswordForUser|existsEmail|existsUsername).*$/i,
  "user:groups":
    /^.*(?:addUserToGroup|removeUserToGroup|addUserToInstanceGroup|removeUserFromInstanceGroup|createInstanceGroup|deleteInstanceGroup|getInstanceGroup|listInstanceGroups|exportInstanceGroups).*$/i,
  "user:invites":
    /^.*(?:invite|acceptInvite|declineInvite|listPendingInvites).*$/i,

  // Workspace Management
  "workspace:list":
    /^.*(?:listWorkspaces|listUserWorkspaces|getWorkspace|existsWorkspace).*$/i,
  "workspace:manage":
    /^.*(?:createWorkspace|deleteWorkspace|archiveWorkspace|unarchiveWorkspace|changeWorkspace|leaveWorkspace|deleteFromWorkspace|installFromWorkspace).*$/i,
  "workspace:settings":
    /^.*(?:editWorkspace|setWorkspaceEncryptionKey|getWorkspaceEncryptionKey).*$/i,
  "workspace:usage": /^.*(?:getWorkspaceUsage|workspaceAcknowledge).*$/i,

  // Script Management
  "script:list":
    /^.*(?:listScripts|getScript|listScriptPaths|existsScript|getRunnable|isOwnerOfPath|customPathExists|existsRoute).*$/i,
  "script:manage":
    /^.*(?:createScript|updateScript|deleteScript|archiveScript|executeComponent).*$/i,
  "script:run":
    /^.*(?:runScript|runRawScript|runScriptPreview|runWaitResultScript).*$/i,
  "script:hub": /^.*(?:getHubScript|queryHubScripts|getTopHubScripts).*$/i,

  // Flow Management
  "flow:list": /^.*(?:listFlows|getFlow|listFlowPaths|existsFlow).*$/i,
  "flow:manage": /^.*(?:createFlow|updateFlow|deleteFlow|archiveFlow).*$/i,
  "flow:run": /^.*(?:runFlow|runFlowPreview|runWaitResultFlow|restartFlow).*$/i,
  "flow:hub": /^.*(?:getHubFlow|listHubFlows).*$/i,

  // Resource Management
  "resource:list":
    /^.*(?:listResource|getResource|existsResource|queryResourceTypes).*$/i,
  "resource:manage": /^.*(?:createResource|updateResource|deleteResource).*$/i,
  "resource:types": /^.*(?:ResourceType|fileResourceTypeToFileExtMap).*$/i,

  // Variable Management
  "variable:list":
    /^.*(?:listVariable|getVariable|existsVariable|listContextualVariables|encryptValue).*$/i,
  "variable:manage":
    /^.*(?:createVariable|updateVariable|deleteVariable|setEnvironmentVariable).*$/i,

  // Schedule Management
  "schedule:list": /^.*(?:listSchedules|getSchedule|existsSchedule).*$/i,
  "schedule:manage":
    /^.*(?:createSchedule|updateSchedule|deleteSchedule|setScheduleEnabled|previewSchedule).*$/i,

  // Trigger Management
  "trigger:list": /^.*(?:list.*Trigger|get.*Trigger|exists.*Trigger).*$/i,
  "trigger:manage":
    /^.*(?:create.*Trigger|update.*Trigger|delete.*Trigger|set.*TriggerEnabled).*$/i,
  "trigger:test": /^.*(?:test.*Connection|test.*Trigger).*$/i,

  // App Management
  "app:list":
    /^.*(?:listApps|getApp|existsApp|listAppPaths|existsRawApp|getRawAppData|listRawApps|getPublicAppByCustomPath|getPublicAppBySecret|getPublicSecretOfApp).*$/i,
  "app:manage":
    /^.*(?:createApp|createRawApp|updateApp|deleteApp|deleteRawApp).*$/i,
  "app:deploy": /^.*(?:getAppHistory|getAppVersion|updateAppHistory).*$/i,
  "app:hub": /^.*(?:getHubApp|listHubApps).*$/i,

  // Folder Management
  "folder:list":
    /^.*(?:listFolders|getFolder|existsFolder|listFolderNames).*$/i,
  "folder:manage": /^.*(?:createFolder|updateFolder|deleteFolder).*$/i,
  "folder:permissions":
    /^.*(?:addOwnerToFolder|removeOwnerToFolder|getGranularAcls|addGranularAcls|removeGranularAcls).*$/i,

  // Group Management
  "group:list": /^.*(?:listGroups|getGroup|listGroupNames).*$/i,
  "group:manage": /^.*(?:createGroup|updateGroup|deleteGroup).*$/i,
  "group:concurrency":
    /^.*(?:listConcurrencyGroups|deleteConcurrencyGroup).*$/i,

  // Database & Storage
  "storage:list":
    /^.*(?:listStoredFiles|loadFile|listAssets|listLogFiles|getLogFile|getLogFileFromStore|fileDownload|fileDownloadParquetAsCsv).*$/i,
  "storage:manage":
    /^.*(?:fileUpload|deleteS3File|moveS3File|get public resource).*$/i,
  "storage:db":
    /^.*(?:databasesExist|duckdbConnection|postgres|getDbClock).*$/i,

  // Integration & OAuth
  "integration:oauth":
    /^.*(?:OAuth|connect|disconnect|loginWithOauth|polarsConnectionSettings|getOAuthConnect|listOAuthConnects|getGlobalConnectedRepositories).*$/i,
  "integration:slack": /^.*(?:slack|Slack).*$/i,
  "integration:teams": /^.*(?:teams|Teams).*$/i,
  "integration:github":
    /^.*(?:github|Github|editGitSyncRepository|deleteGitSyncRepository).*$/i,
  "integration:gcp":
    /^.*(?:deleteGcpSubscription|listAllTGoogleTopicSubscriptions|listGoogleTopics).*$/i,
  "integration:hub": /^.*(?:listHubIntegrations).*$/i,

  // Audit & Logging
  "audit:list": /^.*(?:getAuditLog|listAuditLogs).*$/i,
  "audit:search":
    /^.*(?:searchLogs|countSearchLogs|clearIndex|ListAvailableScopes).*$/i,

  // Settings & Configuration
  "settings:general":
    /^.*(?:getSettings|updateConfig|listConfigs|get config|deleteConfig|editDefaultScripts|get default scripts|listGlobalSettings|getGlobal|getLocal|editCopilotConfig|getCopilotInfo|editWebhook|editErrorHandler|editDeployTo|getDeployTo).*$/i,
  "settings:system":
    /^.*(?:backendVersion|getLicenseId|sendStats|getUsage|geDefaultTags|getCustomTags|isDefaultTagsPerWorkspace).*$/i,
  "settings:storage":
    /^.*(?:editLargeFileStorage|testObjectStorage|getLargeFileStorageConfig|getSecondaryStorageNames|editDucklakeConfig|createDucklakeDatabase|listDucklakes).*$/i,

  // System & Health
  "system:health": /^.*(?:backendUptodate|pingCaptureConfig).*$/i,
  "system:usage": /^.*(?:getUsage|listAutoscalingEvents).*$/i,
  "system:critical":
    /^.*(?:acknowledgeCriticalAlert|acknowledgeAllCriticalAlerts|getCriticalAlerts|getThresholdAlert).*$/i,
  "system:deployment": /^.*(?:deployment|Deployment).*$/i,
  "system:workers":
    /^.*(?:listWorkers|listWorkerGroups|existsWorkerWithTag|getCountsOfJobsWaitingPerTag|listQueue|getQueueCount|getQueueMetrics|listFilteredQueueUuids).*$/i,
  "system:instance":
    /^.*(?:leaveInstance|exportInstallation|importInstallation|isDomainAllowed|getIsPremium|getPremiumInfo|createCustomerPortalSession).*$/i,

  // Captures & Inputs
  "capture:manage": /^.*(?:capture|Capture).*$/i,
  "input:manage": /^.*(?:input|Input).*$/i,

  // Drafts & Templates
  "draft:manage": /^.*(?:draft|Draft).*$/i,
  "template:manage": /^.*(?:template|Template).*$/i,

  // Tutorials & Onboarding
  "tutorial:manage": /^.*(?:tutorial|Tutorial).*$/i,

  // OpenAPI & MCP
  "system:api":
    /^.*(?:DownloadOpenapiSpec|generateOpenapiSpec|getOpenApiYaml|listMcpTools|listAvailablePythonVersions).*$/i,

  // Miscellaneous - catch remaining
  "misc:general": /.*/, // Final catch-all
};

export function categorizeTool(operationId) {
  for (const [category, regex] of Object.entries(patterns)) {
    if (regex.test(operationId)) return category;
  }
  return "misc:general";
}

export function getNamespace(operationId) {
  // Returns the category with ':' replaced by '_' to match older code expectations
  return categorizeTool(operationId).replace(":", "_");
}
