export type PlaygroundLocale = 'en' | 'pt-BR'

export type CategoryKey =
  | 'all'
  | 'catalog'
  | 'docs'
  | 'foundations'
  | 'forms'
  | 'labels'
  | 'feedback'
  | 'layout'

export interface UserTableColumnMessages {
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
  statusActive: string
  statusInactive: string
  statusPending: string
}

export interface PlaygroundMessages {
  categories: Record<CategoryKey, string>
  app: {
    title: string
    versionBadge: string
    stable: string
    footer: string
  }
  theme: {
    switchToLight: string
    switchToDark: string
    lightMode: string
    darkMode: string
  }
  locale: {
    switchToEn: string
    switchToPtBr: string
    en: string
    ptBr: string
    selectLabel: string
  }
  hero: {
    versionLine: string
    titleLine1: string
    titleLine2: string
    subtitle: string
    browseComponents: string
    playground: string
    installDocs: string
    pillarComponentsTitle: string
    pillarComponentsBody: string
    pillarPlaygroundsTitle: string
    pillarPlaygroundsBody: string
    statComponents: string
    statCoverage: string
  }
  cards: {
    button: { label: string; tag: string }
    controls: { label: string; tag: string }
    inputs: { label: string; tag: string }
    color: { label: string; tag: string }
    typography: { label: string; tag: string }
    spacing: { label: string; tag: string }
    icons: { label: string; tagSuffix: string }
    labels: { label: string; tag: string }
    avatar: { label: string }
    loading: { label: string; tag: string }
    messages: { label: string; tag: string }
    chat: { label: string; tag: string }
    layout: { label: string; tag: string }
    datatable: { label: string; tag: string }
    index: {
      titleByCategory: {
        all: string
        forms: string
        labels: string
        feedback: string
        layout: string
      }
    }
  }
  componentIndex: {
    showcaseTitle: string
    items: Record<
      string,
      { count: string; category: CategoryKey }
    >
  }
  layoutPlayground: {
    description: string
    openPlayground: string
    openPanel: string
    panelClose: string
    preview: string
    viewDetails: string
    close: string
    regionsTitle: string
    menuWidthLabel: string
    startCollapsed: string
    footerWidthLabel: string
    footerWidth: {
      full: string
      content: string
    }
    expandMenu: string
    collapseMenu: string
    introLead: string
    introBody: string
    panelDescription: string
    panelTag: string
    slots: {
      header: string
      menu: string
      content: string
      panel: string
      footer: string
      default: string
    }
    regions: {
      header: { label: string; hint: string }
      menu: { label: string; hint: string }
      content: { label: string; hint: string }
      footer: { label: string; hint: string }
    }
    navLabels: Record<string, string>
    sidebar: {
      dashboard: string
      components: string
      overview: string
      button: string
      forms: string
      input: string
      select: string
      feedback: string
      alert: string
      toast: string
      foundations: string
      colors: string
      typography: string
      settings: string
      profile: string
      team: string
    }
  }
  dialogPlayground: {
    open: string
    title: string
    description: string
    body: string
    cancel: string
    confirm: string
    controlsTitle: string
    closeOnOverlay: string
    showTitle: string
    showDescription: string
    showBody: string
    showFooter: string
    showCancelButton: string
    showConfirmButton: string
  }
  overlayDrawerPlayground: {
    open: string
    title: string
    body: string
    closeOnOverlay: string
    closeAriaLabel: string
  }
  tooltipPlayground: {
    trigger: string
    hint: string
  }
  popoverPlayground: {
    trigger: string
    title: string
    body: string
    controlsTitle: string
    showTrigger: string
    showContent: string
    showContentTitle: string
    showContentBody: string
    triggerHiddenHint: string
  }
  layoutPrimitivesPlayground: {
    containerHint: string
    containerContent: string
    action: string
  }
  inputsPlayground: {
    modeWithIcon: string
    modePlain: string
    fields: {
      fullName: string
      email: string
      password: string
      username: string
      phone: string
      website: string
    }
    helpers: {
      emailValid: string
      usernameTaken: string
      websiteLocked: string
    }
    websitePlaceholder: string
    states: {
      default: string
      focus: string
      error: string
      success: string
      disabled: string
    }
  }
  buttonPlayground: {
    previewAction: string
    variantLabel: string
    sizeLabel: string
    stateLabel: string
    iconLabel: string
    iconPlaceholder: string
  }
  controlsPlayground: {
    tabToggle: string
    tabCheckbox: string
    toggles: {
      notifications: string
      darkMode: string
      autoSave: string
      analytics: string
      beta: string
    }
    checkboxes: {
      digest: string
      cookies: string
      beta: string
    }
    drawerCheckboxes: {
      terms: string
      newsletter: string
      twoFactor: string
      partial: string
    }
  }
  typographyPlayground: {
    defaultPreview: string
    inputPlaceholder: string
    scale: {
      display: string
      h1: string
      h2: string
      body: string
      caption: string
      mono: string
    }
  }
  iconsPlayground: {
    searchPlaceholder: string
    footerHint: string
  }
  colorPlayground: {
    footerHint: string
  }
  labelsPlayground: {
    statuses: {
      backlog: string
      done: string
      blocked: string
      inProgress: string
      review: string
      new: string
    }
    boldAppearance: string
  }
  messagesPlayground: {
    deployQueued: string
    testsPassed: string
    rateLimit: string
    buildFailed: string
    savedSuccessfully: string
  }
  loadingPlayground: {
    syncing: string
    metrics: {
      storage: string
      cpu: string
      memory: string
      network: string
    }
  }
  avatarPlayground: {
    roles: {
      designLead: string
      engineer: string
      pm: string
    }
  }
  selectPlayground: {
    modeSingle: string
    modeMulti: string
    placeholderSingle: string
    placeholderMulti: string
  }
  tabsPlayground: {
    tabs: {
      overview: string
      issues: string
      reports: string
      settings: string
    }
    panels: {
      overview: string
      issues: string
      reports: string
      settings: string
    }
  }
  badgePlayground: {
    countLabel: string
  }
  breadcrumbPlayground: {
    depthLabel: string
    separatorLabel: string
    separatorPlaceholder: string
    items: string[]
  }
  paginationPlayground: {
    totalRecordsLabel: string
  }
  modalPlayground: {
    openButton: string
    closeAriaLabel: string
    cancel: string
    controlsTitle: string
    showHeader: string
    showBody: string
    showFooter: string
    showCloseButton: string
    showCancelButton: string
    showPrimaryButton: string
    titles: {
      confirm: string
      form: string
      danger: string
    }
    actions: {
      confirm: string
      form: string
      danger: string
    }
    confirmBody: string
    fields: {
      projectName: string
      description: string
    }
    placeholders: {
      projectName: string
      description: string
    }
    dangerIntro: string
    dangerOutro: string
    dangerAlert: string
  }
  toastPlayground: {
    showAt: string
  }
  colorPicker: {
    selectColor: string
    pickCustom: string
  }
  chatPlayground: {
    openPlayground: string
    preview: {
      userQuestion1: string
      assistantAnswer1: string
      userQuestion2: string
    }
    welcome: string
    inputPlaceholder: string
    models: {
      fast: string
      balanced: string
      deep: string
    }
    suggestions: [string, string, string, string]
    replies: {
      button: string
      tokens: string
      spacing: string
      colors: string
      default: string
    }
    live: {
      modelsLabel: string
      suggestionsLabel: string
      userBadge: string
      sendAriaLabel: string
      typingAriaLabel: string
    }
    usageCode: string
  }
  dataTable: {
    searchPlaceholder: string
    openPlayground: string
    modeClient: string
    modeApi: string
    hints: [string, string, string]
    sortLabel: string
    filtersLabel: string
    activeFilters: string
    noSort: string
    controls: {
      features: string
      pageSizeOptions: string
      textFields: string
      emptyTitlePlaceholder: string
      emptyDescriptionPlaceholder: string
    }
    columns: UserTableColumnMessages
    labels: {
      record: string
      records: string
      page: string
      pages: string
      pageSize: string
      searchAriaLabel: string
      loadingAriaLabel: string
      emptyTitle: string
      emptyDescription: string
      loadingText: string
      filterTitle: string
      filterPlaceholder: string
      filterAriaLabel: string
      filterClear: string
      filterDateFrom: string
      filterDateTo: string
      filterDateFromAriaLabel: string
      filterDateToAriaLabel: string
      filterEnumAll: string
    }
  }
  drawer: {
    component: string
    livePlayground: string
    previewFallback: string
    descriptions: Record<string, string>
  }
  usage: {
    label: string
    copy: string
    copied: string
  }
  docs: {
    badge: string
    title: string
    subtitle: string
    requirements: string
    reqVue: string
    reqNode: string
    installTitle: string
    installBody: string
    stylesTitle: string
    stylesBody: string
    componentsTitle: string
    componentsBody: string
    toastsTitle: string
    toastsBody: string
    toastsBodyHost: string
    toastsBodyUseToast: string
    darkModeTitle: string
    darkModeBody: string
    darkModeBodyClass: string
    darkModeBodyHtml: string
    dataTableTitle: string
    dataTableBody: string
    dataTableBodyFilter: string
    dataTableBodySortStack: string
    dataTableBodyColumnFilters: string
    exportedTitle: string
    groupCategories: Record<string, string>
  }
  componentCatalog: {
    badge: string
    title: string
    subtitle: string
    back: string
    usageHeading: string
    apiHeading: string
    propsHeading: string
    modelsHeading: string
    slotsHeading: string
    compositionHeading: string
    eventsHeading: string
    composableHeading: string
    composableOptionsHeading: string
    colName: string
    colBinding: string
    colType: string
    colDefault: string
    colDescription: string
    colBindings: string
    colOptional: string
    optionalYes: string
    optionalNo: string
    colPayload: string
    colSignature: string
    playgroundHint: string
    navHeading: string
    selectLabel: string
    openPlayground: string
    descriptions: Record<string, string>
  }
}
