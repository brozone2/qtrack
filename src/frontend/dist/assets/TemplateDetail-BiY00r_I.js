import { j as jsxRuntimeExports, c as cn, r as reactExports, R as React, b as composeRefs, d as useComposedRefs, e as useParams, u as useNavigate, a as useQueryClient, L as LoadingSpinner } from "./index-PxEetNKB.js";
import { Q as QuestionStatus, M as MistakeTag, u as useBackend, a as useQuery, b as useMutation } from "./useBackend-CH7lR8h_.js";
import { E as EmptyState, P as ProgressBar } from "./ProgressBar-DMUdzkXb.js";
import { L as Label } from "./label-D-g1bntl.js";
const FILTERS = [
  { key: "all", label: "All" },
  { key: "correct", label: "Solved" },
  { key: "incorrect", label: "Wrong" },
  { key: "revisit", label: "Revisit" },
  { key: "unattempted", label: "Unseen" },
  { key: "redo", label: "Redo" }
];
function FilterBar({ active, onChange, redoCount }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "flex items-center gap-1.5 flex-wrap border-0 p-0 m-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Filter questions" }),
    FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onChange(f.key),
        "data-ocid": `filter.${f.key}_tab`,
        "aria-pressed": active === f.key,
        className: cn(
          "px-3 py-1 rounded-full text-xs font-body font-medium transition-smooth",
          "min-h-[44px] select-none whitespace-nowrap",
          active === f.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
        ),
        children: [
          f.label,
          f.key === "redo" && redoCount != null && redoCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 font-mono", children: redoCount })
        ]
      },
      f.key
    ))
  ] });
}
function computeLevelAccuracy(level, questions, recordMap) {
  var _a;
  let correct = 0;
  let incorrect = 0;
  let revisit = 0;
  for (const q of questions) {
    const status = ((_a = recordMap.get(q)) == null ? void 0 : _a.status) ?? QuestionStatus.Unattempted;
    if (status === QuestionStatus.Correct) correct++;
    else if (status === QuestionStatus.Incorrect) incorrect++;
    else if (status === QuestionStatus.Revisit) revisit++;
  }
  const denominator = correct + incorrect + revisit;
  const accuracy = denominator > 0 ? correct / denominator * 100 : null;
  return {
    level,
    correct,
    incorrect,
    revisit,
    total: questions.length,
    accuracy
  };
}
function heatClass(accuracy) {
  if (accuracy === null) return "bg-secondary border-border";
  if (accuracy >= 80)
    return "bg-[oklch(0.25_0.08_132)] border-[oklch(0.4_0.16_132)]";
  if (accuracy >= 50)
    return "bg-[oklch(0.25_0.08_88)] border-[oklch(0.4_0.18_88)]";
  return "bg-[oklch(0.25_0.08_18)] border-[oklch(0.4_0.14_18)]";
}
function heatTextClass(accuracy) {
  if (accuracy === null) return "text-muted-foreground";
  if (accuracy >= 80) return "text-status-solved";
  if (accuracy >= 50) return "text-status-revisit";
  return "text-status-incorrect";
}
function LevelHeatmap({
  levels,
  levelQuestions,
  recordMap,
  className
}) {
  if (levels.length === 0) return null;
  const accuracies = levels.map(
    (level, idx) => computeLevelAccuracy(level, levelQuestions[idx] ?? [], recordMap)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("space-y-2", className), "data-ocid": "heatmap.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider font-display px-0.5", children: "Level Accuracy Heatmap" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid gap-2",
        style: { gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" },
        "data-ocid": "heatmap.grid",
        children: accuracies.map(({ level, correct, total, accuracy }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `heatmap.card.${idx + 1}`,
            className: cn(
              "rounded-xl border px-3 py-2.5 min-h-[60px] flex flex-col justify-between",
              "transition-smooth",
              heatClass(accuracy)
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-display font-semibold text-xs text-foreground truncate leading-tight",
                  title: level.name,
                  children: level.name
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: [
                "Q",
                Number(level.startQuestion),
                "–Q",
                Number(level.endQuestion)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mt-2 gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "font-mono font-bold text-lg leading-none",
                      heatTextClass(accuracy)
                    ),
                    children: accuracy !== null ? `${Math.round(accuracy)}%` : "—"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground shrink-0", children: [
                  correct,
                  "/",
                  total
                ] })
              ] })
            ]
          },
          String(level.id)
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center gap-3 flex-wrap px-0.5 pt-0.5",
        "aria-label": "Heatmap legend",
        children: [
          { label: "≥80% accurate", dot: "bg-status-solved" },
          {
            label: "50–79%",
            dot: "text-status-revisit bg-[oklch(0.35_0.1_88)]"
          },
          { label: "<50%", dot: "bg-status-incorrect" },
          { label: "No attempts", dot: "bg-secondary" }
        ].map(({ label, dot }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "flex items-center gap-1.5 text-[10px] text-muted-foreground font-body",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("w-2 h-2 rounded-sm shrink-0", dot) }),
              label
            ]
          },
          label
        ))
      }
    )
  ] });
}
function statusBgClass(status) {
  if (status === QuestionStatus.Correct) return "bg-status-solved";
  if (status === QuestionStatus.Incorrect) return "bg-status-incorrect";
  if (status === QuestionStatus.Revisit) return "bg-status-revisit";
  return "bg-status-unattempted";
}
function statusLabel(status) {
  if (status === QuestionStatus.Correct) return "Solved";
  if (status === QuestionStatus.Incorrect) return "Incorrect";
  if (status === QuestionStatus.Revisit) return "Revisit";
  return "Unattempted";
}
function statusTextClass(status) {
  if (status === QuestionStatus.Unattempted) return "text-foreground/60";
  return "text-foreground";
}
function QuestionCell({
  questionNumber,
  status,
  isSelected = false,
  isMarkedForRedo = false,
  onTap,
  "data-ocid": dataOcid
}) {
  const bgClass = statusBgClass(status);
  const textClass = statusTextClass(status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": dataOcid,
      onClick: () => onTap(questionNumber),
      "aria-label": `Question ${questionNumber}`,
      "aria-pressed": isSelected,
      className: cn(
        "relative flex items-center justify-center rounded",
        "min-w-[48px] min-h-[48px] w-full aspect-square",
        "text-sm font-mono font-medium leading-none",
        "transition-smooth select-none",
        bgClass,
        textClass,
        isSelected ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-95" : "hover:brightness-110 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      ),
      children: [
        questionNumber,
        isMarkedForRedo && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            "aria-hidden": true,
            className: "absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-primary"
          }
        )
      ]
    }
  );
}
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler == null ? void 0 : originalEventHandler(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler == null ? void 0 : ourEventHandler(event);
    }
  };
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      var _a;
      const { scope, children, ...context } = props;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      var _a;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
var useLayoutEffect2 = (globalThis == null ? void 0 : globalThis.document) ? reactExports.useLayoutEffect : () => {
};
var useInsertionEffect = React[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({
  prop,
  defaultProp,
  onChange = () => {
  },
  caller
}) {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
    defaultProp,
    onChange
  });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  {
    const isControlledRef = reactExports.useRef(prop !== void 0);
    reactExports.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? "controlled" : "uncontrolled";
        const to = isControlled ? "controlled" : "uncontrolled";
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }
  const setValue = reactExports.useCallback(
    (nextValue) => {
      var _a;
      if (isControlled) {
        const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
        if (value2 !== prop) {
          (_a = onChangeRef.current) == null ? void 0 : _a.call(onChangeRef, value2);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef]
  );
  return [value, setValue];
}
function useUncontrolledState({
  defaultProp,
  onChange
}) {
  const [value, setValue] = reactExports.useState(defaultProp);
  const prevValueRef = reactExports.useRef(value);
  const onChangeRef = reactExports.useRef(onChange);
  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  reactExports.useEffect(() => {
    var _a;
    if (prevValueRef.current !== value) {
      (_a = onChangeRef.current) == null ? void 0 : _a.call(onChangeRef, value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef]);
  return [value, setValue, onChangeRef];
}
function isFunction(value) {
  return typeof value === "function";
}
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}
function useSize(element) {
  const [size, setSize] = reactExports.useState(void 0);
  useLayoutEffect2(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (!entries.length) {
          return;
        }
        const entry = entries[0];
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSizeEntry = entry["borderBoxSize"];
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize["inlineSize"];
          height = borderSize["blockSize"];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }
        setSize({ width, height });
      });
      resizeObserver.observe(element, { box: "border-box" });
      return () => resizeObserver.unobserve(element);
    } else {
      setSize(void 0);
    }
  }, [element]);
  return size;
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a, _b;
  let getter = (_a = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = /* @__PURE__ */ createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const STATUS_BUTTONS = [
  {
    status: QuestionStatus.Unattempted,
    label: "Unseen",
    colorClass: "bg-status-unattempted"
  },
  {
    status: QuestionStatus.Correct,
    label: "Correct",
    colorClass: "bg-status-solved"
  },
  {
    status: QuestionStatus.Incorrect,
    label: "Wrong",
    colorClass: "bg-status-incorrect"
  },
  {
    status: QuestionStatus.Revisit,
    label: "Revisit",
    colorClass: "bg-status-revisit"
  }
];
const MISTAKE_TAGS = [
  { tag: MistakeTag.ConceptError, label: "Concept Error" },
  { tag: MistakeTag.AlgebraMistake, label: "Algebra Mistake" },
  { tag: MistakeTag.SillyMistake, label: "Silly Mistake" },
  { tag: MistakeTag.Guessed, label: "Guessed" },
  { tag: MistakeTag.TimeIssue, label: "Time Issue" }
];
function formatDate(ts) {
  if (!ts) return "";
  const ms = Number(ts);
  const d = new Date(ms);
  return d.toISOString().slice(0, 10);
}
function parseDateToTimestamp(dateStr) {
  if (!dateStr) return null;
  const ms = new Date(dateStr).getTime();
  return Number.isNaN(ms) ? null : BigInt(ms);
}
function QuestionDetailPanel({
  templateId,
  questionNumber,
  record,
  levels: _levels,
  onClose,
  onSave
}) {
  var _a;
  const [status, setStatus] = reactExports.useState(
    (record == null ? void 0 : record.status) ?? QuestionStatus.Unattempted
  );
  const [notes, setNotes] = reactExports.useState((record == null ? void 0 : record.notes) ?? "");
  const [mistakeTags, setMistakeTags] = reactExports.useState(
    (record == null ? void 0 : record.mistakeTags) ?? []
  );
  const [difficulty, setDifficulty] = reactExports.useState(
    (record == null ? void 0 : record.difficultyRating) != null ? Number(record.difficultyRating) : 0
  );
  const [markedForRedo, setMarkedForRedo] = reactExports.useState(
    (record == null ? void 0 : record.markedForRedo) ?? false
  );
  const [lastAttemptedAt, setLastAttemptedAt] = reactExports.useState(
    formatDate(record == null ? void 0 : record.lastAttemptedAt)
  );
  const panelRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const el = panelRef.current;
    if (el) el.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);
  const buildRecord = reactExports.useCallback(
    (overrides = {}) => {
      const now = BigInt(Date.now());
      const base = {
        templateId,
        questionNumber: BigInt(questionNumber),
        status,
        notes: notes || void 0,
        mistakeTags,
        difficultyRating: difficulty > 0 ? BigInt(difficulty) : void 0,
        markedForRedo,
        lastAttemptedAt: lastAttemptedAt ? parseDateToTimestamp(lastAttemptedAt) ?? void 0 : void 0
      };
      const result = { ...base, ...overrides };
      if (!result.lastAttemptedAt && result.status !== QuestionStatus.Unattempted) {
        result.lastAttemptedAt = now;
      }
      return result;
    },
    [
      templateId,
      questionNumber,
      status,
      notes,
      mistakeTags,
      difficulty,
      markedForRedo,
      lastAttemptedAt
    ]
  );
  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    if (!lastAttemptedAt && newStatus !== QuestionStatus.Unattempted) {
      setLastAttemptedAt((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
    }
    const updated = buildRecord({ status: newStatus });
    onSave(updated);
  };
  const handleNotesBlur = () => {
    const updated = buildRecord();
    onSave(updated);
  };
  const handleTagToggle = (tag) => {
    const next = mistakeTags.includes(tag) ? mistakeTags.filter((t) => t !== tag) : [...mistakeTags, tag];
    setMistakeTags(next);
    const updated = buildRecord({ mistakeTags: next });
    onSave(updated);
  };
  const handleDifficulty = (star) => {
    const next = difficulty === star ? 0 : star;
    setDifficulty(next);
    const updated = buildRecord({
      difficultyRating: next > 0 ? BigInt(next) : void 0
    });
    onSave(updated);
  };
  const handleRedoToggle = (val) => {
    setMarkedForRedo(val);
    const updated = buildRecord({ markedForRedo: val });
    onSave(updated);
  };
  const handleDateChange = (val) => {
    setLastAttemptedAt(val);
    const ts = parseDateToTimestamp(val);
    const updated = buildRecord({ lastAttemptedAt: ts ?? void 0 });
    onSave(updated);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:bg-transparent md:backdrop-blur-none cursor-default",
        onClick: onClose,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        },
        "aria-label": "Close detail panel",
        tabIndex: -1,
        "data-ocid": "question_detail.backdrop"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: panelRef,
        tabIndex: -1,
        "aria-modal": true,
        "aria-label": `Question ${questionNumber} detail`,
        "data-ocid": "question_detail.dialog",
        className: cn(
          "fixed z-50 bg-card flex flex-col outline-none",
          "shadow-elevated border-border",
          // Mobile: full-screen slide up
          "inset-x-0 bottom-0 rounded-t-2xl border-t max-h-[92dvh]",
          // Desktop: right-side drawer
          "md:inset-y-0 md:right-0 md:left-auto md:top-0 md:bottom-0 md:w-[380px]",
          "md:rounded-none md:border-t-0 md:border-l md:max-h-full",
          "animate-in slide-in-from-bottom duration-300 md:slide-in-from-right"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-lg text-foreground", children: [
                "Q",
                questionNumber
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "text-xs font-body px-2 py-0.5 rounded-full font-medium",
                    (_a = STATUS_BUTTONS.find((b) => b.status === status)) == null ? void 0 : _a.colorClass,
                    "text-foreground"
                  ),
                  children: statusLabel(status)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                "aria-label": "Close panel",
                "data-ocid": "question_detail.close_button",
                className: "w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
                children: "✕"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-4 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "section",
              {
                "aria-label": "Status",
                "data-ocid": "question_detail.status.section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground uppercase tracking-wide mb-2", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: STATUS_BUTTONS.map((btn) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleStatusChange(btn.status),
                      "data-ocid": `question_detail.status_${btn.status.toLowerCase()}_button`,
                      "aria-pressed": status === btn.status,
                      className: cn(
                        "py-3 rounded-lg text-sm font-body font-semibold transition-smooth",
                        "min-h-[48px] select-none",
                        btn.colorClass,
                        "text-foreground",
                        status === btn.status ? "ring-2 ring-primary ring-offset-1 ring-offset-card" : "opacity-60 hover:opacity-90"
                      ),
                      children: btn.label
                    },
                    btn.status
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-label": "Notes", "data-ocid": "question_detail.notes.section", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-body text-muted-foreground uppercase tracking-wide mb-2 block", children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: notes,
                  onChange: (e) => setNotes(e.target.value),
                  onBlur: handleNotesBlur,
                  placeholder: "Add notes about this question…",
                  "data-ocid": "question_detail.notes.textarea",
                  className: "min-h-[80px] resize-none bg-secondary border-input text-sm font-body",
                  rows: 3
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "section",
              {
                "aria-label": "Mistake Tags",
                "data-ocid": "question_detail.mistake_tags.section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground uppercase tracking-wide mb-2", children: "Mistake Tags" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: MISTAKE_TAGS.map(({ tag, label }) => {
                    const checked = mistakeTags.includes(tag);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "label",
                      {
                        className: cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-smooth",
                          "min-h-[44px] select-none",
                          checked ? "bg-secondary/80" : "hover:bg-secondary/40"
                        ),
                        "data-ocid": `question_detail.tag_${tag.toLowerCase()}_checkbox`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked,
                              onChange: () => handleTagToggle(tag),
                              className: "w-4 h-4 rounded border-input accent-primary"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-foreground", children: label })
                        ]
                      },
                      tag
                    );
                  }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "section",
              {
                "aria-label": "Difficulty",
                "data-ocid": "question_detail.difficulty.section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground uppercase tracking-wide mb-2", children: "Difficulty" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex items-center gap-1.5",
                      role: "radiogroup",
                      "aria-label": "Difficulty rating",
                      children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleDifficulty(star),
                          "aria-label": `${star} star${star > 1 ? "s" : ""}`,
                          "aria-pressed": difficulty >= star,
                          "data-ocid": `question_detail.difficulty_star_${star}`,
                          className: cn(
                            "text-2xl transition-smooth min-h-[44px] min-w-[44px] flex items-center justify-center rounded",
                            "hover:scale-110 active:scale-95",
                            difficulty >= star ? "text-status-revisit" : "text-muted-foreground/30"
                          ),
                          children: "★"
                        },
                        star
                      ))
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "section",
              {
                "aria-label": "Mark for Redo",
                "data-ocid": "question_detail.redo.section",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "redo-switch",
                      className: "text-sm font-body text-foreground cursor-pointer",
                      children: "Mark for Redo"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      id: "redo-switch",
                      checked: markedForRedo,
                      onCheckedChange: handleRedoToggle,
                      "data-ocid": "question_detail.redo.switch",
                      "aria-label": "Mark question for redo"
                    }
                  )
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "section",
              {
                "aria-label": "Last Attempted",
                "data-ocid": "question_detail.last_attempted.section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "last-attempted",
                      className: "text-xs font-body text-muted-foreground uppercase tracking-wide mb-2 block",
                      children: "Last Attempted"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "last-attempted",
                      type: "date",
                      value: lastAttemptedAt,
                      onChange: (e) => handleDateChange(e.target.value),
                      "data-ocid": "question_detail.last_attempted.input",
                      className: cn(
                        "w-full px-3 py-2 rounded-lg bg-secondary border border-input",
                        "text-sm font-mono text-foreground min-h-[44px]",
                        "focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                      )
                    }
                  )
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const TAG_LABELS = {
  [MistakeTag.ConceptError]: "Concept Error",
  [MistakeTag.AlgebraMistake]: "Algebra Mistake",
  [MistakeTag.SillyMistake]: "Silly Mistake",
  [MistakeTag.Guessed]: "Guessed",
  [MistakeTag.TimeIssue]: "Time Issue"
};
const TAG_TIPS = {
  [MistakeTag.ConceptError]: "Review core theory",
  [MistakeTag.AlgebraMistake]: "Practice algebra fundamentals",
  [MistakeTag.SillyMistake]: "Slow down and double-check your work",
  [MistakeTag.Guessed]: "Revisit and solve properly",
  [MistakeTag.TimeIssue]: "Work on speed with timed practice"
};
const TAG_ICON = {
  [MistakeTag.ConceptError]: "📖",
  [MistakeTag.AlgebraMistake]: "🔢",
  [MistakeTag.SillyMistake]: "🎯",
  [MistakeTag.Guessed]: "🎲",
  [MistakeTag.TimeIssue]: "⏱"
};
function computeTopTags(records) {
  const freq = /* @__PURE__ */ new Map();
  for (const r of records) {
    const isWeak = r.status === QuestionStatus.Incorrect || r.status === QuestionStatus.Revisit;
    if (!isWeak) continue;
    for (const tag of r.mistakeTags) {
      freq.set(String(tag), (freq.get(String(tag)) ?? 0) + 1);
    }
  }
  return Array.from(freq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([tag, count]) => ({ tag, count }));
}
function RevisionSuggestion({
  records,
  className
}) {
  const topTags = computeTopTags(records);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn("space-y-2", className),
      "data-ocid": "revision_suggestion.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider font-display px-0.5", children: "Revision Suggestions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border border-border p-3 space-y-2.5", children: topTags.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm text-muted-foreground font-body py-1 text-center",
            "data-ocid": "revision_suggestion.empty_state",
            children: "🎉 No mistakes yet — keep it up!"
          }
        ) : topTags.map(({ tag, count }, idx) => {
          const label = TAG_LABELS[String(tag)] ?? String(tag);
          const tip = TAG_TIPS[String(tag)] ?? "";
          const icon = TAG_ICON[String(tag)] ?? "•";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "flex items-start gap-3 py-1",
                idx !== topTags.length - 1 && "border-b border-border pb-2.5"
              ),
              "data-ocid": `revision_suggestion.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base shrink-0 mt-0.5", "aria-hidden": "true", children: icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded-md",
                          "text-[10px] font-semibold font-display uppercase tracking-wide",
                          "bg-secondary text-secondary-foreground border border-border"
                        ),
                        children: label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-muted-foreground", children: [
                      count,
                      "×"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body leading-snug", children: tip })
                ] })
              ]
            },
            String(tag)
          );
        }) })
      ]
    }
  );
}
function matchesFilter(record, filter, redoSet) {
  if (filter === "all") return true;
  if (filter === "redo")
    return redoSet.has(record ? Number(record.questionNumber) : -1);
  if (!record) return filter === "unattempted";
  if (filter === "correct") return record.status === QuestionStatus.Correct;
  if (filter === "incorrect") return record.status === QuestionStatus.Incorrect;
  if (filter === "revisit") return record.status === QuestionStatus.Revisit;
  if (filter === "unattempted")
    return record.status === QuestionStatus.Unattempted;
  return true;
}
function matchesTagFilter(record, tag) {
  if (tag === "none") return true;
  if (!record) return false;
  return record.mistakeTags.includes(tag);
}
function EditableName({ name, onSave }) {
  const [editing, setEditing] = reactExports.useState(false);
  const [value, setValue] = reactExports.useState(name);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    var _a;
    if (editing) (_a = inputRef.current) == null ? void 0 : _a.focus();
  }, [editing]);
  const commit = () => {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== name) onSave(trimmed);
    else setValue(name);
  };
  if (editing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        value,
        onChange: (e) => setValue(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setValue(name);
            setEditing(false);
          }
        },
        "data-ocid": "template_detail.name.input",
        "aria-label": "Template name",
        className: cn(
          "font-display font-bold text-xl bg-transparent border-b border-primary",
          "focus:outline-none text-foreground w-full max-w-xs"
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => setEditing(true),
      title: "Click to rename",
      "data-ocid": "template_detail.name.edit_button",
      className: "font-display font-bold text-xl text-foreground hover:text-primary transition-smooth text-left",
      children: name
    }
  );
}
function LevelSection({
  level,
  questions,
  recordMap,
  redoSet,
  filter,
  tagFilter,
  selectedQ,
  onTap,
  sectionIndex
}) {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const visibleQs = questions.filter((q) => {
    const rec = recordMap.get(q);
    return matchesFilter(rec, filter, redoSet) && matchesTagFilter(rec, tagFilter);
  });
  const total = questions.length;
  const correct = questions.filter(
    (q) => {
      var _a;
      return ((_a = recordMap.get(q)) == null ? void 0 : _a.status) === QuestionStatus.Correct;
    }
  ).length;
  if (filter !== "all" && visibleQs.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "data-ocid": `template_detail.level.${sectionIndex}`,
      className: "mb-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setCollapsed((c) => !c),
            "data-ocid": `template_detail.level_toggle.${sectionIndex}`,
            "aria-expanded": !collapsed,
            className: cn(
              "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg",
              "bg-secondary/50 hover:bg-secondary/80 transition-smooth",
              "text-left min-h-[44px] mb-2"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground truncate", children: level.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono shrink-0", children: [
                  "Q",
                  Number(level.startQuestion),
                  "–Q",
                  Number(level.endQuestion)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: [
                  correct,
                  "/",
                  total
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "text-muted-foreground text-xs transition-smooth",
                      collapsed && "rotate-180"
                    ),
                    style: { display: "inline-block" },
                    children: "▾"
                  }
                )
              ] })
            ]
          }
        ),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProgressBar,
          {
            label: "",
            count: correct,
            total,
            colorClass: "bg-status-solved",
            className: "px-3 mb-2"
          }
        ),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid gap-1.5",
            style: {
              gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))"
            },
            "data-ocid": `template_detail.grid.${sectionIndex}`,
            children: [
              visibleQs.map((q, idx) => {
                const rec = recordMap.get(q);
                const status = (rec == null ? void 0 : rec.status) ?? QuestionStatus.Unattempted;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  QuestionCell,
                  {
                    questionNumber: q,
                    status,
                    isSelected: selectedQ === q,
                    isMarkedForRedo: redoSet.has(q),
                    onTap,
                    "data-ocid": `template_detail.cell.${idx + 1}`
                  },
                  q
                );
              }),
              filter !== "all" && visibleQs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "col-span-full text-xs text-muted-foreground py-4 text-center font-body", children: "No questions match this filter in this level." })
            ]
          }
        )
      ]
    }
  );
}
function TemplateDetail() {
  const { id } = useParams({ from: "/template/$id" });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [filter, setFilter] = reactExports.useState("all");
  const [tagFilter, setTagFilter] = reactExports.useState("none");
  const [selectedQ, setSelectedQ] = reactExports.useState(null);
  const [optimistic, setOptimistic] = reactExports.useState(
    /* @__PURE__ */ new Map()
  );
  const templateId = BigInt(id ?? "0");
  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplates();
    },
    enabled: !!actor && !isFetching
  });
  const template = templates == null ? void 0 : templates.find((t) => t.id === templateId);
  const { data: levels = [], isLoading: levelsLoading } = useQuery({
    queryKey: ["levels", id],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplateLevels(templateId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: records = [], isLoading: recordsLoading } = useQuery({
    queryKey: ["records", id],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplateRecords(templateId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: redoRecords = [] } = useQuery({
    queryKey: ["redo", id],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRedoMarkedQuestions(templateId);
    },
    enabled: !!actor && !isFetching
  });
  const recordMap = new Map(
    records.map((r) => [Number(r.questionNumber), r])
  );
  for (const [qNum, status] of optimistic.entries()) {
    const existing = recordMap.get(qNum);
    if (existing) {
      recordMap.set(qNum, { ...existing, status });
    } else {
      recordMap.set(qNum, {
        templateId,
        questionNumber: BigInt(qNum),
        status,
        mistakeTags: [],
        markedForRedo: false
      });
    }
  }
  const redoSet = new Set(
    redoRecords.map((r) => Number(r.questionNumber))
  );
  const sortedLevels = [...levels].sort(
    (a, b) => Number(a.order) - Number(b.order)
  );
  const levelQuestions = sortedLevels.map((lvl) => {
    const start = Number(lvl.startQuestion);
    const end = Number(lvl.endQuestion);
    const qs = [];
    for (let q = start; q <= end; q++) qs.push(q);
    return qs;
  });
  const allQuestions = levelQuestions.flat();
  const totalQ = allQuestions.length;
  const attemptedQ = allQuestions.filter(
    (q) => {
      var _a;
      return (((_a = recordMap.get(q)) == null ? void 0 : _a.status) ?? QuestionStatus.Unattempted) !== QuestionStatus.Unattempted;
    }
  ).length;
  const correctQ = allQuestions.filter(
    (q) => {
      var _a;
      return ((_a = recordMap.get(q)) == null ? void 0 : _a.status) === QuestionStatus.Correct;
    }
  ).length;
  const incorrectQ = allQuestions.filter(
    (q) => {
      var _a;
      return ((_a = recordMap.get(q)) == null ? void 0 : _a.status) === QuestionStatus.Incorrect;
    }
  ).length;
  const redoCount = redoSet.size;
  const setStatusMutation = useMutation({
    mutationFn: async ({
      qNum,
      status
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.setQuestionStatus(templateId, BigInt(qNum), status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records", id] });
      queryClient.invalidateQueries({ queryKey: ["redo", id] });
    }
  });
  const updateDetailMutation = useMutation({
    mutationFn: async (r) => {
      if (!actor) throw new Error("No actor");
      return actor.updateQuestionDetail(
        r.templateId,
        r.questionNumber,
        r.notes ?? null,
        r.mistakeTags,
        r.difficultyRating ?? null,
        r.markedForRedo,
        r.lastAttemptedAt ?? null
      );
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ["records", id],
        (old) => {
          if (!old) return [updated];
          const idx = old.findIndex(
            (r) => r.questionNumber === updated.questionNumber
          );
          if (idx === -1) return [...old, updated];
          const next = [...old];
          next[idx] = updated;
          return next;
        }
      );
      queryClient.invalidateQueries({ queryKey: ["redo", id] });
    }
  });
  const updateNameMutation = useMutation({
    mutationFn: async (name) => {
      if (!actor) throw new Error("No actor");
      return actor.updateTemplate(templateId, name);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["templates"] })
  });
  const handleCellTap = reactExports.useCallback((qNum) => {
    setSelectedQ((prev) => prev === qNum ? null : qNum);
  }, []);
  const handlePanelSave = reactExports.useCallback(
    (updated) => {
      const qNum = Number(updated.questionNumber);
      setOptimistic((prev) => {
        const next = new Map(prev);
        next.set(qNum, updated.status);
        return next;
      });
      setStatusMutation.mutate({ qNum, status: updated.status });
      updateDetailMutation.mutate(updated);
    },
    [setStatusMutation, updateDetailMutation]
  );
  const handlePanelClose = reactExports.useCallback(() => {
    setSelectedQ(null);
    setOptimistic(/* @__PURE__ */ new Map());
  }, []);
  const isLoading = isFetching || levelsLoading || recordsLoading;
  if (!id) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: "⚠️",
        title: "Template not found",
        action: {
          label: "Back to Dashboard",
          onClick: () => navigate({ to: "/" })
        },
        "data-ocid": "template_detail.empty_state"
      }
    );
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center min-h-[60vh]",
        "data-ocid": "template_detail.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
      }
    );
  }
  const selectedRecord = selectedQ != null ? recordMap.get(selectedQ) ?? null : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen", "data-ocid": "template_detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-20 bg-card border-b border-border shadow-subtle px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/" }),
          "data-ocid": "template_detail.back_button",
          "aria-label": "Back to Dashboard",
          className: cn(
            "flex items-center gap-1.5 text-muted-foreground hover:text-foreground",
            "transition-smooth text-sm font-body shrink-0 min-h-[44px] px-1"
          ),
          children: [
            "← ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Dashboard" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: template ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EditableName,
        {
          name: template.name,
          onSave: (name) => updateNameMutation.mutate(name)
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-xl text-foreground", children: "Template" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-4xl mx-auto px-4 py-4 space-y-4",
        "data-ocid": "template_detail.content",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card rounded-xl p-4 border border-border space-y-3",
              "data-ocid": "template_detail.progress.section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ProgressBar,
                  {
                    label: "Overall progress",
                    count: attemptedQ,
                    total: totalQ,
                    colorClass: "bg-primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "grid grid-cols-4 gap-2 pt-1",
                    "data-ocid": "template_detail.stats.section",
                    children: [
                      { label: "Solved", value: correctQ, color: "text-status-solved" },
                      {
                        label: "Wrong",
                        value: incorrectQ,
                        color: "text-status-incorrect"
                      },
                      {
                        label: "Unseen",
                        value: totalQ - attemptedQ,
                        color: "text-muted-foreground"
                      },
                      {
                        label: "Redo",
                        value: redoCount,
                        color: "text-status-revisit"
                      }
                    ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: cn(
                            "font-mono font-bold text-lg leading-none",
                            color
                          ),
                          children: value
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-body", children: label })
                    ] }, label))
                  }
                )
              ]
            }
          ),
          sortedLevels.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            LevelHeatmap,
            {
              levels: sortedLevels,
              levelQuestions,
              recordMap
            }
          ),
          sortedLevels.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(RevisionSuggestion, { records }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-2",
              "data-ocid": "template_detail.filters.section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FilterBar,
                  {
                    active: filter,
                    onChange: setFilter,
                    redoCount
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "tag-filter",
                      className: "text-xs text-muted-foreground font-body shrink-0",
                      children: "Tag:"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      id: "tag-filter",
                      value: tagFilter,
                      onChange: (e) => setTagFilter(e.target.value),
                      "data-ocid": "template_detail.tag_filter.select",
                      className: cn(
                        "text-xs font-body bg-secondary border border-input rounded-lg",
                        "px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                        "min-h-[32px] transition-smooth"
                      ),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "none", children: "All tags" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: MistakeTag.ConceptError, children: "Concept Error" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: MistakeTag.AlgebraMistake, children: "Algebra Mistake" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: MistakeTag.SillyMistake, children: "Silly Mistake" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: MistakeTag.Guessed, children: "Guessed" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: MistakeTag.TimeIssue, children: "Time Issue" })
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          sortedLevels.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: "📂",
              title: "No levels yet",
              description: "Add levels to your template to start tracking questions.",
              "data-ocid": "template_detail.levels.empty_state"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "template_detail.levels.list", children: sortedLevels.map((level, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            LevelSection,
            {
              level,
              questions: levelQuestions[idx],
              recordMap,
              redoSet,
              filter,
              tagFilter,
              selectedQ,
              onTap: handleCellTap,
              sectionIndex: idx + 1
            },
            String(level.id)
          )) })
        ]
      }
    ),
    selectedQ != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuestionDetailPanel,
      {
        templateId,
        questionNumber: selectedQ,
        record: selectedRecord,
        levels: sortedLevels,
        onClose: handlePanelClose,
        onSave: handlePanelSave
      }
    )
  ] });
}
export {
  TemplateDetail as default
};
