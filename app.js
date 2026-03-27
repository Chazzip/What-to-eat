(function () {
  const CONFIG = Object.assign(
    {
      useSupabase: false,
      supabaseUrl: "",
      supabaseAnonKey: "",
      localStorageKey: "cute-dinner-local-v3",
      localDrawHistoryKey: "cute-dinner-draw-history-v3",
      recentDrawWindow: 3,
      savedMealsLimit: 16,
      localDrawLimit: 10,
      cooldownPenalty: 0.18,
      adminEmailHint: "",
      persistMealLogsToServer: true
    },
    window.DINNER_APP_CONFIG || {}
  );

  const RATING_LABELS = {
    1: "拉完了",
    2: "NPC",
    3: "人上人",
    4: "顶级",
    5: "夯爆了"
  };

  const DEFAULT_TAGS = ["粉面", "米饭", "甜口", "小吃", "正餐", "夜宵", "热卤", "香口", "重口"];
  const DEFAULT_MOODS = ["快手解决", "想吃热乎", "想吃甜的", "重口一点", "想吃正餐", "约会感", "随便吃也开心"];

  const LEGACY_DINNER_MAP = {
    "妇幼街": ["芳芳热卤", "牛爷骚", "大碗先生", "铁胖子", "朝阳满地"],
    "南门口": ["红牛粉店", "湘遇糯米饭", "新疆手抓饭", "蚵仔煎", "桂湘缘螺蛳粉", "阿元螺蛳粉", "金记糖油坨坨", "港道菠萝包", "酸嘢", "李记双皮奶", "胖冬瓜", "串小白"],
    "司门口": ["Humble guy", "盟重"],
    "林科大": ["小桃麻糍", "舒芙蕾", "窦窦烤面筋", "拌的么", "嘟享吃鸡公煲", "薛笑笑螺蛳粉", "台湾卤肉饭", "玉米王饼", "食全食美", "肉夹馍", "焖面", "膳当家", "糖水铺", "嘿阿达西"],
    "培元桥": ["小二面馆", "哆哆煲仔饭", "鸿源烧烤"],
    "佳兆业": ["大碗先生", "河马食堂", "李小饭", "麦如麦立送", "常德小碗菜", "盒马水果", "阿捡汴京炸鸡"],
    "家附近": ["老柴枝", "楼下烧烤", "无名炒饭", "柳柳饭店", "粉二哥", "卤肉饭", "老上海馄饨铺", "奶香铺子", "大嘴巴酸辣粉", "绿叶水果"],
    "广济桥": ["笨罗卜总店", "面13口", "享味堂甜水铺", "正宗兰州牛肉拉面", "周记粉店", "德胜煲仔屋"],
    "新家附近": ["宁乡宁鸡蛋面", "彭厨", "江南糕点（铁板鸭）", "丹妹麻辣烫", "李易面馆"],
    "大学城": ["整理君糯米饭", "恰一口麻糍", "提拉米苏", "临榆炸鸡", "酯花道", "里脊肉饼", "黄记绿豆饼", "神奇的鸡蛋灌饼", "周椰记"],
    "友阿金苹果": ["盛香亭转转热卤", "水城羊肉粉", "莹雯螺蛳粉", "科星巷糖油坨坨", "刘记里脊肉", "鱿鱼嘴烧烤"],
    "Special day": ["友友饭店", "冰火楼小馆", "时间仓", "未下山", "宴长沙", "南景饭店", "玉芙蓉", "王品（橘洲观江店）"]
  };

  const dom = {
    connectionBadge: byId("connectionBadge"),
    adminBadge: byId("adminBadge"),
    savedMealsBadge: byId("savedMealsBadge"),
    discoverTab: byId("discoverTab"),
    journalTab: byId("journalTab"),
    manageTab: byId("manageTab"),
    discoverView: byId("discoverView"),
    journalView: byId("journalView"),
    manageView: byId("manageView"),
    pickerBadge: byId("pickerBadge"),
    resultStateBadge: byId("resultStateBadge"),
    journalBadge: byId("journalBadge"),
    areaSelect: byId("areaSelect"),
    preferenceChips: byId("preferenceChips"),
    clearPreferenceButton: byId("clearPreferenceButton"),
    avoidRecentToggle: byId("avoidRecentToggle"),
    preferHighRatingToggle: byId("preferHighRatingToggle"),
    decideButton: byId("decideButton"),
    rerollButton: byId("rerollButton"),
    resultArea: byId("resultArea"),
    resultFood: byId("resultFood"),
    resultNote: byId("resultNote"),
    resultMeta: byId("resultMeta"),
    mealRatingInput: byId("mealRatingInput"),
    mealNoteInput: byId("mealNoteInput"),
    markEatenButton: byId("markEatenButton"),
    favoriteButton: byId("favoriteButton"),
    deprioritizeButton: byId("deprioritizeButton"),
    savedMealsList: byId("savedMealsList"),
    areaCount: byId("areaCount"),
    foodCount: byId("foodCount"),
    mealLogCount: byId("mealLogCount"),
    localHistoryCount: byId("localHistoryCount"),
    journalAreaCount: byId("journalAreaCount"),
    journalFoodCount: byId("journalFoodCount"),
    journalMealLogCount: byId("journalMealLogCount"),
    journalLocalHistoryCount: byId("journalLocalHistoryCount"),
    manageAreaCount: byId("manageAreaCount"),
    manageFoodCount: byId("manageFoodCount"),
    manageMealLogCount: byId("manageMealLogCount"),
    manageLocalHistoryCount: byId("manageLocalHistoryCount"),
    manageAreaMap: byId("manageAreaMap"),
    localDrawHistory: byId("localDrawHistory"),
    journalLocalDrawHistory: byId("journalLocalDrawHistory"),
    authHintBadge: byId("authHintBadge"),
    authStatusText: byId("authStatusText"),
    authEmailInput: byId("authEmailInput"),
    authPasswordInput: byId("authPasswordInput"),
    loginButton: byId("loginButton"),
    logoutButton: byId("logoutButton"),
    exportButton: byId("exportButton"),
    resetLocalButton: byId("resetLocalButton"),
    areaNameInput: byId("areaNameInput"),
    areaSortInput: byId("areaSortInput"),
    areaEditorBadge: byId("areaEditorBadge"),
    areaEditorHint: byId("areaEditorHint"),
    newAreaButton: byId("newAreaButton"),
    saveAreaButton: byId("saveAreaButton"),
    clearAreaFormButton: byId("clearAreaFormButton"),
    deleteAreaButton: byId("deleteAreaButton"),
    editorAreaSelect: byId("editorAreaSelect"),
    foodEditorBadge: byId("foodEditorBadge"),
    foodEditorHint: byId("foodEditorHint"),
    foodNameInput: byId("foodNameInput"),
    foodTagsInput: byId("foodTagsInput"),
    foodMoodsInput: byId("foodMoodsInput"),
    foodRatingInput: byId("foodRatingInput"),
    foodWeightInput: byId("foodWeightInput"),
    foodHoursInput: byId("foodHoursInput"),
    foodMapInput: byId("foodMapInput"),
    foodNoteInput: byId("foodNoteInput"),
    newFoodButton: byId("newFoodButton"),
    saveFoodButton: byId("saveFoodButton"),
    clearFoodFormButton: byId("clearFoodFormButton"),
    deleteFoodButton: byId("deleteFoodButton"),
    inventoryList: byId("inventoryList"),
    toast: byId("toast")
  };

  const state = {
    mode: "local",
    supabase: null,
    remoteConfigured: false,
    session: null,
    isAdmin: false,
    areas: [],
    foods: [],
    savedMeals: [],
    localDraws: loadLocalDrawHistory(),
    selectedPreference: "",
    currentResultFoodId: "",
    currentResultAreaId: "",
    editingAreaId: "",
    editingFoodId: "",
    areaEditorMode: "create",
    foodEditorMode: "create",
    activeView: "discover",
    rollingTimer: null,
    toastTimer: null
  };

  init();

  async function init() {
    bindEvents();
    await setupSupabase();
    await loadData();
    renderAll();
    showToast("页面已准备好，可以开始抽签。");
  }

  function bindEvents() {
    dom.areaSelect.addEventListener("change", () => {
      const areaId = dom.areaSelect.value;
      dom.editorAreaSelect.value = areaId;
      syncAreaFormWithSelection(areaId);
      renderAreaMap();
      renderInventory();
    });

    dom.avoidRecentToggle.addEventListener("change", renderResultActions);
    dom.preferHighRatingToggle.addEventListener("change", renderResultActions);
    dom.clearPreferenceButton.addEventListener("click", () => {
      state.selectedPreference = "";
      renderAll();
    });
    dom.decideButton.addEventListener("click", () => decideDinner());
    dom.rerollButton.addEventListener("click", () => rerollCurrentArea());
    dom.markEatenButton.addEventListener("click", markCurrentAsEaten);
    dom.favoriteButton.addEventListener("click", () => adjustCurrentFoodWeight(1));
    dom.deprioritizeButton.addEventListener("click", () => adjustCurrentFoodWeight(-1));
    dom.loginButton.addEventListener("click", loginAdmin);
    dom.logoutButton.addEventListener("click", logoutAdmin);
    dom.exportButton.addEventListener("click", exportCurrentData);
    dom.resetLocalButton.addEventListener("click", resetLocalFallback);
    dom.newAreaButton.addEventListener("click", () => enterCreateAreaMode());
    dom.saveAreaButton.addEventListener("click", saveArea);
    dom.clearAreaFormButton.addEventListener("click", clearAreaForm);
    dom.deleteAreaButton.addEventListener("click", deleteSelectedArea);
    dom.newFoodButton.addEventListener("click", () => enterCreateFoodMode(dom.editorAreaSelect.value || dom.areaSelect.value));
    dom.saveFoodButton.addEventListener("click", saveFood);
    dom.clearFoodFormButton.addEventListener("click", clearFoodForm);
    dom.deleteFoodButton.addEventListener("click", deleteSelectedFood);
    dom.editorAreaSelect.addEventListener("change", () => {
      renderInventory();
    });
    dom.discoverTab.addEventListener("click", () => setActiveView("discover"));
    dom.journalTab.addEventListener("click", () => setActiveView("journal"));
    dom.manageTab.addEventListener("click", () => setActiveView("manage"));
  }

  async function setupSupabase() {
    state.remoteConfigured = Boolean(
      CONFIG.useSupabase &&
      CONFIG.supabaseUrl &&
      CONFIG.supabaseAnonKey &&
      window.supabase &&
      typeof window.supabase.createClient === "function"
    );

    if (!state.remoteConfigured) {
      state.mode = "local";
      return;
    }

    try {
      state.supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });

      const result = await state.supabase.auth.getSession();
      state.session = result.data.session;
      state.mode = "supabase";
      await refreshAdminState();

      state.supabase.auth.onAuthStateChange(async function (_event, session) {
        state.session = session;
        await refreshAdminState();
        await loadData();
        renderAll();
      });
    } catch (error) {
      console.error(error);
      state.mode = "fallback";
      state.remoteConfigured = false;
      showToast("Supabase 初始化失败，已回退本地模式。");
    }
  }

  async function refreshAdminState() {
    state.isAdmin = false;
    if (!state.supabase || !state.session || !state.session.user) {
      return;
    }

    const { data, error } = await state.supabase
      .from("app_admins")
      .select("user_id")
      .eq("user_id", state.session.user.id)
      .maybeSingle();

    if (!error && data) {
      state.isAdmin = true;
    }
  }

  async function loadData() {
    if (state.mode === "supabase" && state.supabase) {
      try {
        const [areasResponse, foodsResponse, mealsResponse] = await Promise.all([
          state.supabase.from("areas").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
          state.supabase.from("foods").select("*").eq("is_active", true).order("created_at", { ascending: true }),
          state.supabase.from("meal_logs").select("*").order("created_at", { ascending: false }).limit(CONFIG.savedMealsLimit)
        ]);

        if (areasResponse.error) {
          throw areasResponse.error;
        }
        if (foodsResponse.error) {
          throw foodsResponse.error;
        }
        if (mealsResponse.error) {
          throw mealsResponse.error;
        }

        state.areas = (areasResponse.data || []).map(normalizeArea);
        state.foods = (foodsResponse.data || []).map(normalizeFood);
        state.savedMeals = (mealsResponse.data || []).map(normalizeMealLog);
        ensureSelections();
        return;
      } catch (error) {
        console.error(error);
        state.mode = "fallback";
        showToast("Supabase 读取失败，当前先使用本地回退数据。");
      }
    }

    const localStore = loadLocalStore();
    state.areas = localStore.areas.map(normalizeArea);
    state.foods = localStore.foods.map(normalizeFood);
    state.savedMeals = localStore.mealLogs.map(normalizeMealLog);
    ensureSelections();
  }

  function ensureSelections() {
    const firstAreaId = state.areas[0] ? state.areas[0].id : "";

    if (dom.areaSelect.value && !state.areas.find((area) => area.id === dom.areaSelect.value)) {
      dom.areaSelect.value = "";
    }

    if (!state.areas.find((area) => area.id === dom.editorAreaSelect.value)) {
      dom.editorAreaSelect.value = dom.areaSelect.value || firstAreaId;
    }

    if (!state.areas.find((area) => area.id === state.currentResultAreaId)) {
      state.currentResultAreaId = "";
      state.currentResultFoodId = "";
    }

    if (state.editingAreaId && !state.areas.find((area) => area.id === state.editingAreaId)) {
      state.editingAreaId = "";
    }

    if (state.editingFoodId && !state.foods.find((food) => food.id === state.editingFoodId)) {
      state.editingFoodId = "";
    }
  }

  function renderAll() {
    renderConnectionState();
    renderActiveView();
    renderSelectOptions();
    renderFilters();
    renderStats();
    renderAreaMap();
    renderSavedMeals();
    renderLocalDrawHistory();
    renderInventory();
    renderAuthState();
    renderResult();
    renderEditorState();
  }

  function renderConnectionState() {
    const modeText = state.mode === "supabase"
      ? "在线"
      : state.mode === "fallback"
        ? "回退中"
        : "本地";

    dom.connectionBadge.textContent = modeText;
    dom.adminBadge.textContent = state.isAdmin ? "可编辑" : "只读";
    dom.savedMealsBadge.textContent = state.savedMeals.length + " 条";
    dom.authHintBadge.textContent = canEditRemote() ? "可编辑" : "只读模式";
  }

  function renderActiveView() {
    const map = {
      discover: { tab: dom.discoverTab, view: dom.discoverView },
      journal: { tab: dom.journalTab, view: dom.journalView },
      manage: { tab: dom.manageTab, view: dom.manageView }
    };

    Object.keys(map).forEach((key) => {
      const isActive = state.activeView === key;
      map[key].tab.classList[isActive ? "add" : "remove"]("active");
      map[key].tab.setAttribute("aria-selected", isActive ? "true" : "false");
      map[key].view.classList[isActive ? "add" : "remove"]("active");
    });
  }

  function renderSelectOptions() {
    fillAreaSelect(dom.areaSelect, "全部区域", true);
    fillAreaSelect(dom.editorAreaSelect, "选择所属区域", false);
    ensureSelections();
  }

  function fillAreaSelect(selectElement, placeholder, allowBlank) {
    const selectedValue = selectElement.value;
    selectElement.innerHTML = "";

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    selectElement.appendChild(placeholderOption);

    state.areas.forEach((area) => {
      const option = document.createElement("option");
      option.value = area.id;
      option.textContent = area.name;
      selectElement.appendChild(option);
    });

    if (state.areas.find((area) => area.id === selectedValue)) {
      selectElement.value = selectedValue;
    } else if (!allowBlank && !selectElement.value && state.areas[0]) {
      selectElement.value = state.areas[0].id;
    }
  }

  function renderFilters() {
    renderChipGroup(dom.preferenceChips, buildPreferenceOptions(), state.selectedPreference, function (value) {
      state.selectedPreference = state.selectedPreference === value ? "" : value;
      renderAll();
    });

    renderResultActions();
  }

  function renderChipGroup(container, items, activeValue, onClick) {
    container.innerHTML = "";

    items.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chip" + (item === activeValue ? " active" : "");
      button.textContent = item;
      button.addEventListener("click", function () {
        onClick(item);
      });
      container.appendChild(button);
    });
  }

  function renderStats() {
    const areaCount = String(state.areas.length);
    const foodCount = String(state.foods.length);
    const mealCount = String(state.savedMeals.length);
    const localCount = String(state.localDraws.length);

    dom.areaCount.textContent = areaCount;
    dom.foodCount.textContent = foodCount;
    dom.mealLogCount.textContent = mealCount;
    dom.localHistoryCount.textContent = localCount;
    dom.journalAreaCount.textContent = areaCount;
    dom.journalFoodCount.textContent = foodCount;
    dom.journalMealLogCount.textContent = mealCount;
    dom.journalLocalHistoryCount.textContent = localCount;
    dom.manageAreaCount.textContent = areaCount;
    dom.manageFoodCount.textContent = foodCount;
    dom.manageMealLogCount.textContent = mealCount;
    dom.manageLocalHistoryCount.textContent = localCount;
    dom.journalBadge.textContent = mealCount + " 条";
  }

  function renderAreaMap() {
    dom.manageAreaMap.innerHTML = "";

    state.areas.forEach((area) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "area-pill" + (dom.areaSelect.value === area.id ? " active" : "");
      button.textContent = area.name + " · " + getFoodsByArea(area.id).length;
      button.addEventListener("click", function () {
        dom.areaSelect.value = area.id;
        dom.editorAreaSelect.value = area.id;
        enterEditAreaMode(area.id);
        if (state.foodEditorMode === "create") {
          enterCreateFoodMode(area.id);
        }
        renderAreaMap();
        renderInventory();
      });
      dom.manageAreaMap.appendChild(button);
    });
  }

  function renderSavedMeals() {
    renderTimeline(dom.savedMealsList, state.savedMeals, function (meal) {
      const row = document.createElement("div");
      row.className = "timeline-item";

      const title = document.createElement("strong");
      title.textContent = meal.food_name + " @" + meal.area_name;

      const meta = document.createElement("div");
      meta.className = "timeline-row";
      meta.appendChild(makeMetaChip(formatDateTime(meal.eaten_at || meal.created_at)));
      if (meal.user_rating) {
        meta.appendChild(makeMetaChip("体验 " + formatRatingLabel(meal.user_rating)));
      }
      if (meal.selected_tags[0]) {
        meta.appendChild(makeMetaChip("偏好 " + meal.selected_tags[0]));
      }

      const note = document.createElement("p");
      note.className = "muted";
      note.textContent = meal.note || "没有额外备注。";

      row.appendChild(title);
      row.appendChild(meta);
      row.appendChild(note);
      return row;
    }, "还没有保存过记录。");
  }

  function renderLocalDrawHistory() {
    const factory = function (entry) {
      const row = document.createElement("div");
      row.className = "timeline-item";

      const title = document.createElement("strong");
      title.textContent = entry.food_name + " @" + entry.area_name;

      const meta = document.createElement("div");
      meta.className = "timeline-row";
      meta.appendChild(makeMetaChip(formatDateTime(entry.created_at)));
      if (entry.preference) {
        meta.appendChild(makeMetaChip("偏好 " + entry.preference));
      }

      row.appendChild(title);
      row.appendChild(meta);
      return row;
    };

    renderTimeline(dom.localDrawHistory, state.localDraws, factory, "还没有抽中过。");
    renderTimeline(dom.journalLocalDrawHistory, state.localDraws, factory, "还没有抽中过。");
  }

  function renderTimeline(container, items, factory, emptyText) {
    container.innerHTML = "";

    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "timeline-empty";
      empty.textContent = emptyText;
      container.appendChild(empty);
      return;
    }

    items.forEach((item) => {
      container.appendChild(factory(item));
    });
  }

  function renderInventory() {
    dom.inventoryList.innerHTML = "";

    const areaId = dom.editorAreaSelect.value;
    const foods = areaId ? getFoodsByArea(areaId) : state.foods.slice();

    if (!foods.length) {
      const empty = document.createElement("p");
      empty.className = "timeline-empty";
      empty.textContent = "这个区域还没有美食，先在上面新增一条。";
      dom.inventoryList.appendChild(empty);
      return;
    }

    foods
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"))
      .forEach((food) => {
        const card = document.createElement("article");
        card.className = "inventory-card" + (food.id === state.editingFoodId ? " active" : "");
        card.addEventListener("click", function () {
          fillFoodForm(food);
        });

        const head = document.createElement("div");
        head.className = "inventory-head";

        const title = document.createElement("h4");
        title.textContent = food.name;

        const area = document.createElement("small");
        area.textContent = getAreaName(food.area_id);

        const titleWrap = document.createElement("div");
        titleWrap.appendChild(title);
        titleWrap.appendChild(area);
        head.appendChild(titleWrap);

        const ratingChip = makeMetaChip("评分 " + formatRatingLabel(food.rating) + " / 权重 " + toNumber(food.revisit_weight, 3));
        head.appendChild(ratingChip);

        const meta = document.createElement("div");
        meta.className = "result-meta";
        getFoodTags(food).slice(0, 4).forEach((tag) => meta.appendChild(makeMetaChip(tag)));
        getFoodMoods(food).slice(0, 2).forEach((mood) => meta.appendChild(makeMetaChip(mood)));

        const note = document.createElement("p");
        note.textContent = food.note || "还没有备注。";

        const actions = document.createElement("div");
        actions.className = "inventory-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "secondary-btn";
        editButton.textContent = "编辑";
        editButton.addEventListener("click", function (event) {
          event.stopPropagation();
          fillFoodForm(food);
        });

        actions.appendChild(editButton);

        if (food.map_link) {
          const link = document.createElement("a");
          link.href = food.map_link;
          link.target = "_blank";
          link.rel = "noreferrer";
          link.textContent = "导航";
          link.className = "secondary-btn";
          link.style.textDecoration = "none";
          link.addEventListener("click", function (event) {
            event.stopPropagation();
          });
          actions.appendChild(link);
        }

        card.appendChild(head);
        card.appendChild(meta);
        card.appendChild(note);
        card.appendChild(actions);
        dom.inventoryList.appendChild(card);
      });
  }

  function renderAuthState() {
    if (state.mode !== "supabase") {
      dom.authStatusText.textContent = "当前是本地模式。这里的修改只保存在当前浏览器。";
      dom.loginButton.disabled = true;
      dom.logoutButton.disabled = true;
      return;
    }

    dom.loginButton.disabled = false;
    dom.logoutButton.disabled = false;

    if (state.session && state.session.user) {
      const prefix = state.isAdmin ? "当前账号可编辑：" : "当前账号只能查看：";
      dom.authStatusText.textContent = prefix + state.session.user.email;
      return;
    }

    const hint = CONFIG.adminEmailHint ? "建议使用 " + CONFIG.adminEmailHint + " 登录。" : "请使用有权限的账号登录。";
    dom.authStatusText.textContent = "当前为只读访问。" + hint;
  }

  function renderResult() {
    dom.pickerBadge.textContent = buildCandidateSummaryText();

    const resultFood = getFoodById(state.currentResultFoodId);
    if (!resultFood) {
      dom.resultArea.textContent = dom.areaSelect.value ? "当前区域：" + getAreaName(dom.areaSelect.value) : "先选一个区域";
      dom.resultFood.textContent = "让这顿饭自己出现";
      dom.resultNote.textContent = "区域和偏好会一起决定结果。";
      dom.resultMeta.innerHTML = "";
      dom.resultStateBadge.textContent = "等待开始";
      renderResultActions();
      return;
    }

    const areaName = getAreaName(resultFood.area_id);
    dom.resultArea.textContent = "这次锁定：" + areaName;
    dom.resultFood.textContent = resultFood.name;
    dom.resultNote.textContent = resultFood.note || "没有备注，这次就纯凭直觉出发。";
    dom.resultStateBadge.textContent = "结果已揭晓";

    dom.resultMeta.innerHTML = "";
    dom.resultMeta.appendChild(makeMetaChip("评分 " + formatRatingLabel(resultFood.rating)));
    dom.resultMeta.appendChild(makeMetaChip("复吃权重 " + toNumber(resultFood.revisit_weight, 3)));

    if (resultFood.business_hours) {
      dom.resultMeta.appendChild(makeMetaChip(resultFood.business_hours));
    }

    getFoodTags(resultFood).forEach((tag) => {
      dom.resultMeta.appendChild(makeMetaChip(tag));
    });

    getFoodMoods(resultFood).forEach((mood) => {
      dom.resultMeta.appendChild(makeMetaChip(mood));
    });

    if (resultFood.map_link) {
      const link = document.createElement("a");
      link.href = resultFood.map_link;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.className = "meta-chip";
      link.textContent = "打开导航";
      link.style.textDecoration = "none";
      dom.resultMeta.appendChild(link);
    }

    renderResultActions();
  }

  function renderResultActions() {
    const hasResult = Boolean(getFoodById(state.currentResultFoodId));
    const canPersist = canEditRemote();

    dom.markEatenButton.disabled = !hasResult || !canPersist;
    dom.favoriteButton.disabled = !hasResult || !canPersist;
    dom.deprioritizeButton.disabled = !hasResult || !canPersist;
    dom.rerollButton.disabled = !hasResult;
  }

  function renderEditorState() {
    const editable = canEditRemote();
    const controls = [
      dom.areaNameInput,
      dom.areaSortInput,
      dom.newAreaButton,
      dom.saveAreaButton,
      dom.clearAreaFormButton,
      dom.deleteAreaButton,
      dom.editorAreaSelect,
      dom.foodEditorBadge,
      dom.foodNameInput,
      dom.foodTagsInput,
      dom.foodMoodsInput,
      dom.foodRatingInput,
      dom.foodWeightInput,
      dom.foodHoursInput,
      dom.foodMapInput,
      dom.foodNoteInput,
      dom.newFoodButton,
      dom.saveFoodButton,
      dom.clearFoodFormButton,
      dom.deleteFoodButton
    ];

    controls.forEach((element) => {
      element.disabled = !editable;
    });

    if (!editable && state.mode === "supabase") {
      dom.areaNameInput.placeholder = "登录管理员后可编辑";
      dom.foodNameInput.placeholder = "登录管理员后可编辑";
    } else {
      dom.areaNameInput.placeholder = "例如：五一广场 / 公司附近";
      dom.foodNameInput.placeholder = "例如：螺蛳粉 / 煲仔饭 / 热卤";
    }

    dom.areaEditorBadge.textContent = state.areaEditorMode === "edit" ? "编辑模式" : "新增模式";
    dom.areaEditorHint.textContent = state.areaEditorMode === "edit"
      ? "当前保存会修改这个区域本身。想新增新区域，请点“新增区域模式”。"
      : "这里用来新增区域。点右侧“区域地图”里的区域，也可以切换到编辑该区域。";
    dom.saveAreaButton.textContent = state.areaEditorMode === "edit" ? "保存区域修改" : "新增这个区域";
    dom.deleteAreaButton.disabled = !editable || state.areaEditorMode !== "edit";

    const currentFood = getFoodById(state.editingFoodId);
    dom.foodEditorBadge.textContent = state.foodEditorMode === "edit" ? "编辑模式" : "新增模式";
    dom.foodEditorHint.textContent = state.foodEditorMode === "edit" && currentFood
      ? "当前保存会覆盖“" + currentFood.name + "”。想新增新条目，请点“新增美食模式”。"
      : "当前会新增一条新的美食。点下面库存卡片后，才会进入编辑并覆盖那一条。";
    dom.saveFoodButton.textContent = state.foodEditorMode === "edit" ? "保存这条修改" : "新增这条美食";
    dom.deleteFoodButton.disabled = !editable || state.foodEditorMode !== "edit" || !currentFood;
    if (!state.currentResultFoodId) {
      dom.rerollButton.disabled = true;
    }
  }

  async function decideDinner() {
    const candidates = buildCandidates();
    if (!candidates.length) {
      dom.resultStateBadge.textContent = "没有候选";
      dom.resultNote.textContent = "当前筛选太严格了，试试清空偏好或切换区域。";
      showToast("当前条件下没有可抽取的美食。");
      return;
    }

    setRollingState(true);
    let counter = 0;
    const maxRolls = Math.min(Math.max(candidates.length + 10, 14), 20);
    let finalChoice = candidates[0].food;

    state.rollingTimer = window.setInterval(function () {
      const choice = weightedPick(candidates);
      finalChoice = choice.food;

      dom.resultArea.textContent = "目标区域：" + getAreaName(finalChoice.area_id);
      dom.resultFood.textContent = finalChoice.name;
      dom.resultNote.textContent = "让纠结先晃几下。";
      dom.resultStateBadge.textContent = "随机中...";

      counter += 1;
      if (counter >= maxRolls) {
        window.clearInterval(state.rollingTimer);
        state.rollingTimer = null;
        setRollingState(false);
        handleFinalChoice(finalChoice);
      }
    }, 95);
  }

  function rerollCurrentArea() {
    if (!state.currentResultFoodId) {
      return;
    }
    decideDinner();
  }

  function buildCandidates() {
    let areaId = dom.areaSelect.value;

    const selectedPreference = state.selectedPreference;
    const recentIds = getRecentFoodIds();
    const preferHighRating = dom.preferHighRatingToggle.checked;
    const avoidRecent = dom.avoidRecentToggle.checked;

    const filtered = state.foods.filter((food) => {
      if (areaId && food.area_id !== areaId) {
        return false;
      }
      if (selectedPreference && !matchesPreference(food, selectedPreference)) {
        return false;
      }
      return true;
    });

    return filtered.map((food) => {
      let weight = 3;
      if (preferHighRating) {
        weight += toNumber(food.rating, 3) * 1.6 + toNumber(food.revisit_weight, 3) * 2;
      } else {
        weight += toNumber(food.revisit_weight, 3);
      }

      if (selectedPreference && matchesPreference(food, selectedPreference)) {
        weight += 2.6;
      }

      if (avoidRecent && recentIds.includes(food.id)) {
        weight *= CONFIG.cooldownPenalty;
      }

      if (food.last_eaten_at && getDaysSince(food.last_eaten_at) <= 7) {
        weight *= 0.6;
      }

      return {
        food: food,
        weight: Math.max(weight, 0.2)
      };
    });
  }

  function handleFinalChoice(food) {
    state.currentResultFoodId = food.id;
    state.currentResultAreaId = food.area_id;
    pushLocalDraw(food);
    renderResult();
    showToast("这次抽中了：" + food.name);
  }

  function setRollingState(isRolling) {
    dom.decideButton.disabled = isRolling;
    dom.rerollButton.disabled = isRolling || !state.currentResultFoodId;
    dom.pickerBadge.textContent = isRolling ? "随机中..." : buildCandidateSummaryText();
  }

  async function markCurrentAsEaten() {
    const food = getFoodById(state.currentResultFoodId);
    if (!food) {
      showToast("先抽出一个结果再记录。");
      return;
    }

    if (!canEditRemote()) {
      showToast("当前是只读模式，登录后才能保存记录。");
      return;
    }

    const now = new Date().toISOString();
    const mealPayload = {
      id: state.mode === "supabase" ? undefined : createLocalId("meal"),
      food_id: food.id,
      area_id: food.area_id,
      food_name: food.name,
      area_name: getAreaName(food.area_id),
      mood: "",
      selected_tags: state.selectedPreference ? [state.selectedPreference] : [],
      status: "eaten",
      user_rating: dom.mealRatingInput.value ? Number(dom.mealRatingInput.value) : null,
      note: dom.mealNoteInput.value.trim(),
      created_at: now,
      eaten_at: now
    };

    if (state.mode === "supabase" && CONFIG.persistMealLogsToServer) {
      const { error: insertError } = await state.supabase.from("meal_logs").insert(mealPayload);
      if (insertError) {
        showToast("保存记录失败：" + insertError.message);
        return;
      }

      const { error: updateError } = await state.supabase
        .from("foods")
        .update({
          eat_count: toNumber(food.eat_count, 0) + 1,
          last_eaten_at: now
        })
        .eq("id", food.id);

      if (updateError) {
        showToast("更新美食状态失败：" + updateError.message);
        return;
      }

      await loadData();
    } else {
      const store = loadLocalStore();
      store.mealLogs.unshift(mealPayload);
      store.mealLogs = store.mealLogs.slice(0, CONFIG.savedMealsLimit);

      store.foods = store.foods.map((item) => {
        if (item.id !== food.id) {
          return item;
        }
        return Object.assign({}, item, {
          eat_count: toNumber(item.eat_count, 0) + 1,
          last_eaten_at: now
        });
      });

      saveLocalStore(store);
      await loadData();
    }

    dom.mealRatingInput.value = "";
    dom.mealNoteInput.value = "";
    renderAll();
    showToast("这次记录已经保存。");
  }

  async function adjustCurrentFoodWeight(delta) {
    const food = getFoodById(state.currentResultFoodId);
    if (!food) {
      showToast("先抽出一个结果再调整。");
      return;
    }

    if (!canEditRemote()) {
      showToast("当前是只读模式，无法修改权重。");
      return;
    }

    const nextWeight = clamp(toNumber(food.revisit_weight, 3) + delta, 1, 5);

    if (state.mode === "supabase") {
      const { error } = await state.supabase
        .from("foods")
        .update({ revisit_weight: nextWeight })
        .eq("id", food.id);

      if (error) {
        showToast("权重调整失败：" + error.message);
        return;
      }
      await loadData();
    } else {
      const store = loadLocalStore();
      store.foods = store.foods.map((item) => item.id === food.id ? Object.assign({}, item, { revisit_weight: nextWeight }) : item);
      saveLocalStore(store);
      await loadData();
    }

    state.currentResultFoodId = food.id;
    renderAll();
    showToast(delta > 0 ? "以后会更常推荐它。" : "以后会少推一点。");
  }

  async function loginAdmin() {
    if (state.mode !== "supabase" || !state.supabase) {
      showToast("当前未启用 Supabase 登录。");
      return;
    }

    const email = dom.authEmailInput.value.trim();
    const password = dom.authPasswordInput.value;

    if (!email || !password) {
      showToast("请先输入管理员邮箱和密码。");
      return;
    }

    const { error } = await state.supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      showToast("登录失败：" + error.message);
      return;
    }

    dom.authPasswordInput.value = "";
    showToast("管理员登录成功。");
  }

  async function logoutAdmin() {
    if (state.mode !== "supabase" || !state.supabase) {
      return;
    }

    const { error } = await state.supabase.auth.signOut();
    if (error) {
      showToast("退出失败：" + error.message);
      return;
    }
    showToast("已退出管理员登录。");
  }

  async function saveArea() {
    if (!canEditRemote()) {
      showToast("当前是只读模式，无法编辑区域。");
      return;
    }

    const name = dom.areaNameInput.value.trim();
    if (!name) {
      showToast("请输入区域名称。");
      dom.areaNameInput.focus();
      return;
    }

    const sortOrder = dom.areaSortInput.value ? Number(dom.areaSortInput.value) : state.areas.length + 1;
    const payload = {
      name: name,
      sort_order: sortOrder
    };
    const wasEditingArea = state.areaEditorMode === "edit" && Boolean(state.editingAreaId);

    if (state.mode === "supabase") {
      let response;
      if (wasEditingArea) {
        response = await state.supabase.from("areas").update(payload).eq("id", state.editingAreaId).select().single();
      } else {
        response = await state.supabase.from("areas").insert(payload).select().single();
      }

      if (response.error) {
        showToast("保存区域失败：" + response.error.message);
        return;
      }

      state.editingAreaId = response.data.id;
      await loadData();
    } else {
      const store = loadLocalStore();
      if (wasEditingArea) {
        store.areas = store.areas.map((area) => area.id === state.editingAreaId ? Object.assign({}, area, payload) : area);
      } else {
        state.editingAreaId = createLocalId("area");
        store.areas.push({
          id: state.editingAreaId,
          created_at: new Date().toISOString(),
          name: name,
          sort_order: sortOrder
        });
      }

      saveLocalStore(store);
      await loadData();
    }

    dom.areaSelect.value = state.editingAreaId || dom.areaSelect.value;
    dom.editorAreaSelect.value = state.editingAreaId || dom.editorAreaSelect.value;
    enterEditAreaMode(dom.editorAreaSelect.value);
    if (state.foodEditorMode === "create") {
      enterCreateFoodMode(dom.editorAreaSelect.value);
    }
    renderAll();
    showToast(wasEditingArea ? "区域修改已保存。" : "新区域已创建。");
  }

  async function deleteSelectedArea() {
    const areaId = state.editingAreaId || dom.editorAreaSelect.value || dom.areaSelect.value;
    const area = getAreaById(areaId);

    if (!area) {
      showToast("当前没有可删除的区域。");
      return;
    }

    if (!canEditRemote()) {
      showToast("当前是只读模式，无法删除区域。");
      return;
    }

    const confirmed = window.confirm("确定删除区域“" + area.name + "”以及它下面的所有美食吗？");
    if (!confirmed) {
      return;
    }

    if (state.mode === "supabase") {
      const { error } = await state.supabase.from("areas").delete().eq("id", area.id);
      if (error) {
        showToast("删除区域失败：" + error.message);
        return;
      }
      await loadData();
    } else {
      const store = loadLocalStore();
      store.areas = store.areas.filter((item) => item.id !== area.id);
      store.foods = store.foods.filter((item) => item.area_id !== area.id);
      saveLocalStore(store);
      await loadData();
    }

    clearAreaForm();
    clearFoodForm();
    renderAll();
    showToast("区域已删除。");
  }

  async function saveFood() {
    if (!canEditRemote()) {
      showToast("当前是只读模式，无法编辑美食。");
      return;
    }

    const areaId = dom.editorAreaSelect.value;
    const name = dom.foodNameInput.value.trim();
    if (!areaId) {
      showToast("请先选择所属区域。");
      return;
    }
    if (!name) {
      showToast("请输入美食名称。");
      dom.foodNameInput.focus();
      return;
    }

    const payload = {
      area_id: areaId,
      name: name,
      tags: parseTagList(dom.foodTagsInput.value),
      moods: parseTagList(dom.foodMoodsInput.value),
      rating: Number(dom.foodRatingInput.value),
      revisit_weight: Number(dom.foodWeightInput.value),
      price_level: getFoodById(state.editingFoodId)?.price_level || "normal",
      business_hours: dom.foodHoursInput.value.trim(),
      map_link: dom.foodMapInput.value.trim(),
      note: dom.foodNoteInput.value.trim(),
      is_active: true
    };

    const isEditingFood = state.foodEditorMode === "edit" && Boolean(state.editingFoodId);

    if (state.mode === "supabase") {
      let response;
      if (isEditingFood) {
        response = await state.supabase.from("foods").update(payload).eq("id", state.editingFoodId).select().single();
      } else {
        response = await state.supabase.from("foods").insert(payload).select().single();
      }

      if (response.error) {
        showToast("保存美食失败：" + response.error.message);
        return;
      }

      state.editingFoodId = response.data.id;
      await loadData();
    } else {
      const store = loadLocalStore();
      if (isEditingFood) {
        store.foods = store.foods.map((food) => food.id === state.editingFoodId ? Object.assign({}, food, payload) : food);
      } else {
        state.editingFoodId = createLocalId("food");
        store.foods.push(
          Object.assign({}, payload, {
            id: state.editingFoodId,
            eat_count: 0,
            last_eaten_at: null,
            created_at: new Date().toISOString()
          })
        );
      }

      saveLocalStore(store);
      await loadData();
    }

    if (isEditingFood) {
      const savedFood = getFoodById(state.editingFoodId);
      if (savedFood) {
        fillFoodForm(savedFood);
      }
      showToast("这条美食修改已保存。");
    } else {
      const preserveAreaId = areaId;
      clearFoodForm();
      dom.editorAreaSelect.value = preserveAreaId;
      showToast("新美食已新增，现在可以继续添加下一条。");
    }

    renderAll();
  }

  async function deleteSelectedFood() {
    const food = getFoodById(state.editingFoodId);
    if (!food) {
      showToast("先从库存卡片里选中一个美食。");
      return;
    }

    if (!canEditRemote()) {
      showToast("当前是只读模式，无法删除美食。");
      return;
    }

    const confirmed = window.confirm("确定删除“" + food.name + "”吗？");
    if (!confirmed) {
      return;
    }

    if (state.mode === "supabase") {
      const { error } = await state.supabase.from("foods").delete().eq("id", food.id);
      if (error) {
        showToast("删除美食失败：" + error.message);
        return;
      }
      await loadData();
    } else {
      const store = loadLocalStore();
      store.foods = store.foods.filter((item) => item.id !== food.id);
      saveLocalStore(store);
      await loadData();
    }

    clearFoodForm();
    renderAll();
    showToast("美食已删除。");
  }

  function fillFoodForm(food) {
    state.foodEditorMode = "edit";
    state.editingFoodId = food.id;
    dom.editorAreaSelect.value = food.area_id;
    dom.foodNameInput.value = food.name;
    dom.foodTagsInput.value = (food.tags || []).join(", ");
    dom.foodMoodsInput.value = (food.moods || []).join(", ");
    dom.foodRatingInput.value = String(toNumber(food.rating, 3));
    dom.foodWeightInput.value = String(toNumber(food.revisit_weight, 3));
    dom.foodHoursInput.value = food.business_hours || "";
    dom.foodMapInput.value = food.map_link || "";
    dom.foodNoteInput.value = food.note || "";
    renderEditorState();
    renderInventory();
  }

  function clearFoodForm() {
    state.foodEditorMode = "create";
    state.editingFoodId = "";
    dom.foodNameInput.value = "";
    dom.foodTagsInput.value = "";
    dom.foodMoodsInput.value = "";
    dom.foodRatingInput.value = "3";
    dom.foodWeightInput.value = "3";
    dom.foodHoursInput.value = "";
    dom.foodMapInput.value = "";
    dom.foodNoteInput.value = "";
    renderEditorState();
    renderInventory();
  }

  function clearAreaForm() {
    enterCreateAreaMode();
  }

  function syncAreaFormWithSelection(areaId) {
    const area = getAreaById(areaId);
    if (!area) {
      enterCreateAreaMode();
      return;
    }
    enterEditAreaMode(area.id);
  }

  function enterEditAreaMode(areaId) {
    const area = getAreaById(areaId);
    if (!area) {
      enterCreateAreaMode();
      return;
    }

    state.areaEditorMode = "edit";
    state.editingAreaId = area.id;
    dom.areaNameInput.value = area.name;
    dom.areaSortInput.value = String(toNumber(area.sort_order, 0));
    renderEditorState();
  }

  function enterCreateAreaMode() {
    state.areaEditorMode = "create";
    state.editingAreaId = "";
    dom.areaNameInput.value = "";
    dom.areaSortInput.value = "";
    renderEditorState();
  }

  function enterCreateFoodMode(preferredAreaId) {
    const areaId = preferredAreaId || dom.editorAreaSelect.value || dom.areaSelect.value || (state.areas[0] ? state.areas[0].id : "");
    state.foodEditorMode = "create";
    state.editingFoodId = "";
    if (areaId) {
      dom.editorAreaSelect.value = areaId;
    }
    dom.foodNameInput.value = "";
    dom.foodTagsInput.value = "";
    dom.foodMoodsInput.value = "";
    dom.foodRatingInput.value = "3";
    dom.foodWeightInput.value = "3";
    dom.foodHoursInput.value = "";
    dom.foodMapInput.value = "";
    dom.foodNoteInput.value = "";
    renderEditorState();
    renderInventory();
  }

  function exportCurrentData() {
    const payload = {
      exported_at: new Date().toISOString(),
      mode: state.mode,
      areas: state.areas,
      foods: state.foods,
      saved_meals: state.savedMeals,
      local_draws: state.localDraws
    };

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dinner-data-export.json";
    link.click();
    URL.revokeObjectURL(url);
    showToast("当前数据已导出。");
  }

  async function resetLocalFallback() {
    const confirmed = window.confirm("确定重置本地回退数据和本地抽签历史吗？");
    if (!confirmed) {
      return;
    }

    localStorage.removeItem(CONFIG.localStorageKey);
    localStorage.removeItem(CONFIG.localDrawHistoryKey);
    state.localDraws = [];

    if (state.mode !== "supabase") {
      await loadData();
      renderAll();
    } else {
      renderLocalDrawHistory();
      renderStats();
    }

    showToast("本地回退数据已重置。");
  }

  function pushLocalDraw(food) {
    const drawEntry = {
      id: createLocalId("draw"),
      food_id: food.id,
      food_name: food.name,
      area_id: food.area_id,
      area_name: getAreaName(food.area_id),
      preference: state.selectedPreference,
      created_at: new Date().toISOString()
    };

    state.localDraws.unshift(drawEntry);
    state.localDraws = state.localDraws.slice(0, CONFIG.localDrawLimit);
    saveLocalDrawHistory(state.localDraws);
    renderLocalDrawHistory();
    renderStats();
  }

  function getRecentFoodIds() {
    const ids = [];
    const recentDraws = state.localDraws.slice(0, CONFIG.recentDrawWindow).map((entry) => entry.food_id);
    const recentMeals = state.savedMeals.slice(0, CONFIG.recentDrawWindow).map((entry) => entry.food_id).filter(Boolean);
    recentDraws.concat(recentMeals).forEach((id) => {
      if (id && !ids.includes(id)) {
        ids.push(id);
      }
    });
    return ids;
  }

  function buildCandidateSummaryText() {
    const count = buildCandidates().length;
    return count ? "当前有 " + count + " 个候选" : "当前没有候选";
  }

  function buildPreferenceOptions() {
    const options = new Set(DEFAULT_TAGS);
    DEFAULT_MOODS.forEach((item) => options.add(item));
    state.foods.forEach((food) => {
      getFoodTags(food).forEach((tag) => options.add(tag));
      getFoodMoods(food).forEach((mood) => options.add(mood));
    });
    return Array.from(options);
  }

  function canEditRemote() {
    return state.mode !== "supabase" || state.isAdmin;
  }

  function getAreaById(areaId) {
    return state.areas.find((area) => area.id === areaId) || null;
  }

  function getAreaName(areaId) {
    const area = getAreaById(areaId);
    return area ? area.name : "未分区";
  }

  function getFoodById(foodId) {
    return state.foods.find((food) => food.id === foodId) || null;
  }

  function getFoodsByArea(areaId) {
    return state.foods.filter((food) => food.area_id === areaId);
  }

  function getFoodTags(food) {
    return normalizeStringArray(food.tags).length ? normalizeStringArray(food.tags) : inferTagsFromName(food.name);
  }

  function getFoodMoods(food) {
    return normalizeStringArray(food.moods).length ? normalizeStringArray(food.moods) : inferMoodsFromName(food.name);
  }

  function matchesPreference(food, preference) {
    return getFoodTags(food).includes(preference) || getFoodMoods(food).includes(preference);
  }

  function loadLocalStore() {
    try {
      const raw = localStorage.getItem(CONFIG.localStorageKey);
      if (!raw) {
        const seed = buildDefaultLocalStore();
        saveLocalStore(seed);
        return seed;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.areas) || !Array.isArray(parsed.foods) || !Array.isArray(parsed.mealLogs)) {
        const seed = buildDefaultLocalStore();
        saveLocalStore(seed);
        return seed;
      }
      return parsed;
    } catch (error) {
      console.error(error);
      const seed = buildDefaultLocalStore();
      saveLocalStore(seed);
      return seed;
    }
  }

  function saveLocalStore(payload) {
    localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(payload));
  }

  function loadLocalDrawHistory() {
    try {
      const raw = localStorage.getItem(CONFIG.localDrawHistoryKey);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(0, CONFIG.localDrawLimit) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  function saveLocalDrawHistory(items) {
    localStorage.setItem(CONFIG.localDrawHistoryKey, JSON.stringify(items));
  }

  function buildDefaultLocalStore() {
    const areas = [];
    const foods = [];

    Object.entries(LEGACY_DINNER_MAP).forEach(function ([areaName, foodNames], areaIndex) {
      const areaId = createLocalId("area");
      areas.push({
        id: areaId,
        name: areaName,
        sort_order: areaIndex + 1,
        created_at: new Date().toISOString()
      });

      foodNames.forEach(function (foodName) {
        foods.push({
          id: createLocalId("food"),
          area_id: areaId,
          name: foodName,
          tags: inferTagsFromName(foodName),
          moods: inferMoodsFromName(foodName),
          rating: inferRating(foodName),
          revisit_weight: 3,
          price_level: inferBudgetFromName(foodName),
          business_hours: "",
          map_link: "",
          note: "",
          eat_count: 0,
          last_eaten_at: null,
          is_active: true,
          created_at: new Date().toISOString()
        });
      });
    });

    return {
      areas: areas,
      foods: foods,
      mealLogs: []
    };
  }

  function normalizeArea(area) {
    return {
      id: String(area.id),
      name: String(area.name || ""),
      sort_order: toNumber(area.sort_order, 0),
      created_at: area.created_at || new Date().toISOString()
    };
  }

  function normalizeFood(food) {
    return {
      id: String(food.id),
      area_id: String(food.area_id),
      name: String(food.name || ""),
      tags: normalizeStringArray(food.tags),
      moods: normalizeStringArray(food.moods),
      rating: toNumber(food.rating, 3),
      revisit_weight: toNumber(food.revisit_weight, 3),
      price_level: food.price_level || "normal",
      business_hours: String(food.business_hours || ""),
      map_link: String(food.map_link || ""),
      note: String(food.note || ""),
      eat_count: toNumber(food.eat_count, 0),
      last_eaten_at: food.last_eaten_at || null,
      is_active: food.is_active !== false,
      created_at: food.created_at || new Date().toISOString()
    };
  }

  function normalizeMealLog(log) {
    return {
      id: String(log.id || createLocalId("meal")),
      food_id: log.food_id || "",
      area_id: log.area_id || "",
      food_name: String(log.food_name || ""),
      area_name: String(log.area_name || ""),
      mood: String(log.mood || ""),
      selected_tags: normalizeStringArray(log.selected_tags),
      status: String(log.status || "eaten"),
      user_rating: log.user_rating ? Number(log.user_rating) : null,
      note: String(log.note || ""),
      created_at: log.created_at || new Date().toISOString(),
      eaten_at: log.eaten_at || null
    };
  }

  function inferTagsFromName(name) {
    const tags = new Set();

    if (/粉|面|米线|拉面/.test(name)) tags.add("粉面");
    if (/饭|煲仔|卤肉饭|盖码/.test(name)) tags.add("米饭");
    if (/糖|甜|奶|麻糍|双皮奶|提拉米苏|菠萝包|舒芙蕾|绿豆饼/.test(name)) tags.add("甜口");
    if (/卤/.test(name)) tags.add("热卤");
    if (/烤|炸|鸡|里脊|烧烤/.test(name)) tags.add("香口");
    if (/螺蛳|酸辣|辣|麻辣/.test(name)) tags.add("重口");
    if (/串|烧烤|烤/.test(name)) tags.add("夜宵");
    if (/饼|糍|双皮奶|糖油|水果/.test(name)) tags.add("小吃");

    if (!tags.size) {
      tags.add("正餐");
    } else if (!tags.has("小吃") && !tags.has("甜口")) {
      tags.add("正餐");
    }

    return Array.from(tags);
  }

  function inferMoodsFromName(name) {
    const moods = new Set();

    if (/甜|奶|麻糍|双皮奶|提拉米苏|菠萝包|舒芙蕾|糖油/.test(name)) moods.add("想吃甜的");
    if (/粉|面|饭|煲|拉面|焖/.test(name)) moods.add("想吃正餐");
    if (/卤|烤|炸|螺蛳|麻辣|骚/.test(name)) moods.add("重口一点");
    if (/粉|面|煲|拉面|糖水/.test(name)) moods.add("想吃热乎");
    if (/麻糍|菠萝包|双皮奶|酸嘢|绿豆饼|糖油/.test(name)) moods.add("快手解决");
    if (/王品|宴|未下山|冰火楼|玉芙蓉|友友饭店|南景/.test(name)) moods.add("约会感");

    if (!moods.size) {
      moods.add("随便吃也开心");
    }

    return Array.from(moods);
  }

  function inferBudgetFromName(name) {
    if (/王品|宴|未下山|冰火楼|玉芙蓉|友友饭店|南景/.test(name)) {
      return "treat";
    }
    if (/糖|奶|糍|饼|双皮奶|水果|菠萝包/.test(name)) {
      return "budget";
    }
    return "normal";
  }

  function inferRating(name) {
    if (/王品|宴|玉芙蓉|未下山/.test(name)) {
      return 5;
    }
    if (/螺蛳|热卤|煲仔|舒芙蕾|麻糍|糖油/.test(name)) {
      return 4;
    }
    return 3;
  }

  function parseTagList(input) {
    return input
      .split(/[\n,，]/)
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function normalizeStringArray(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value
      .map(function (item) {
        return String(item).trim();
      })
      .filter(Boolean);
  }

  function makeMetaChip(text) {
    const chip = document.createElement("span");
    chip.className = "meta-chip";
    chip.textContent = text;
    return chip;
  }

  function weightedPick(candidates) {
    const totalWeight = candidates.reduce(function (sum, item) {
      return sum + item.weight;
    }, 0);

    let cursor = Math.random() * totalWeight;
    for (let index = 0; index < candidates.length; index += 1) {
      cursor -= candidates[index].weight;
      if (cursor <= 0) {
        return candidates[index];
      }
    }

    return candidates[candidates.length - 1];
  }

  function pickRandom(items) {
    if (!items.length) {
      return null;
    }
    return items[Math.floor(Math.random() * items.length)];
  }

  function getDaysSince(dateString) {
    const date = new Date(dateString);
    const diff = Date.now() - date.getTime();
    return diff / (1000 * 60 * 60 * 24);
  }

  function formatDateTime(value) {
    if (!value) {
      return "刚刚";
    }
    return new Intl.DateTimeFormat("zh-CN", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  }

  function formatRatingLabel(value) {
    return RATING_LABELS[toNumber(value, 3)] || RATING_LABELS[3];
  }

  function showToast(message) {
    clearTimeout(state.toastTimer);
    dom.toast.textContent = message;
    dom.toast.classList.add("show");
    state.toastTimer = window.setTimeout(function () {
      dom.toast.classList.remove("show");
    }, 2200);
  }

  function setActiveView(view) {
    state.activeView = view;
    renderActiveView();
  }

  function toNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function createLocalId(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
  }

  function byId(id) {
    return document.getElementById(id);
  }
})();
