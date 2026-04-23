import { j as jsxRuntimeExports, c as cn, u as useNavigate, r as reactExports, B as Button } from "./index-PxEetNKB.js";
import { L as Label } from "./label-D-g1bntl.js";
import { u as useBackend } from "./useBackend-CH7lR8h_.js";
import { c as createLucideIcon, a as useCreateTemplate, P as Plus } from "./useTemplates-HpVsIlc1.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function validateLevels(rows) {
  const errors = rows.map(() => ({}));
  let valid = true;
  rows.forEach((row, i) => {
    if (!row.name.trim()) {
      errors[i].name = "Level name is required";
      valid = false;
    }
    const start = Number.parseInt(row.startQ, 10);
    const end = Number.parseInt(row.endQ, 10);
    if (!row.startQ || Number.isNaN(start) || start < 1) {
      errors[i].startQ = "Enter a valid start (≥ 1)";
      valid = false;
    }
    if (!row.endQ || Number.isNaN(end) || end < 1) {
      errors[i].endQ = "Enter a valid end (≥ 1)";
      valid = false;
    }
    if (!errors[i].startQ && !errors[i].endQ && start >= end) {
      errors[i].range = "Start must be less than end";
      valid = false;
    }
  });
  if (valid) {
    for (let i = 0; i < rows.length; i++) {
      for (let j = i + 1; j < rows.length; j++) {
        const aStart = Number.parseInt(rows[i].startQ, 10);
        const aEnd = Number.parseInt(rows[i].endQ, 10);
        const bStart = Number.parseInt(rows[j].startQ, 10);
        const bEnd = Number.parseInt(rows[j].endQ, 10);
        const overlaps = aStart <= bEnd && bStart <= aEnd;
        if (overlaps) {
          errors[i].range = `Overlaps with Level ${j + 1}`;
          errors[j].range = `Overlaps with Level ${i + 1}`;
          valid = false;
        }
      }
    }
  }
  return { valid, errors };
}
function LevelRowItem({
  row,
  index,
  error,
  canRemove,
  onChange,
  onRemove
}) {
  const prefix = `level_${index}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `create_template.level_row.${index}`,
      className: "group relative bg-secondary/50 border border-border rounded-lg p-4 flex flex-col gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider", children: [
            "Level ",
            index
          ] }),
          canRemove && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onRemove(row.id),
              "data-ocid": `create_template.remove_level_button.${index}`,
              "aria-label": `Remove Level ${index}`,
              className: "w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-1 flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: `${prefix}-name`,
                className: "text-xs text-muted-foreground font-body",
                children: "Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: `${prefix}-name`,
                "data-ocid": `create_template.level_name_input.${index}`,
                placeholder: "e.g. Level 1",
                value: row.name,
                onChange: (e) => onChange(row.id, "name", e.target.value),
                className: cn(
                  error.name && "border-destructive focus-visible:ring-destructive"
                )
              }
            ),
            error.name && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                "data-ocid": `create_template.level_name_error.${index}`,
                className: "text-xs text-destructive flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3 shrink-0" }),
                  error.name
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: `${prefix}-start`,
                className: "text-xs text-muted-foreground font-body",
                children: "Start Q#"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: `${prefix}-start`,
                "data-ocid": `create_template.level_start_input.${index}`,
                type: "number",
                placeholder: "1",
                min: 1,
                value: row.startQ,
                onChange: (e) => onChange(row.id, "startQ", e.target.value),
                className: cn(
                  "font-mono",
                  (error.startQ || error.range) && "border-destructive focus-visible:ring-destructive"
                )
              }
            ),
            error.startQ && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                "data-ocid": `create_template.level_start_error.${index}`,
                className: "text-xs text-destructive flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3 shrink-0" }),
                  error.startQ
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: `${prefix}-end`,
                className: "text-xs text-muted-foreground font-body",
                children: "End Q#"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: `${prefix}-end`,
                "data-ocid": `create_template.level_end_input.${index}`,
                type: "number",
                placeholder: "40",
                min: 1,
                value: row.endQ,
                onChange: (e) => onChange(row.id, "endQ", e.target.value),
                className: cn(
                  "font-mono",
                  (error.endQ || error.range) && "border-destructive focus-visible:ring-destructive"
                )
              }
            ),
            error.endQ && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                "data-ocid": `create_template.level_end_error.${index}`,
                className: "text-xs text-destructive flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3 shrink-0" }),
                  error.endQ
                ]
              }
            )
          ] })
        ] }),
        error.range && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            "data-ocid": `create_template.level_range_error.${index}`,
            className: "text-xs text-destructive flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3 shrink-0" }),
              error.range
            ]
          }
        )
      ]
    }
  );
}
let _rowCounter = 0;
function newRow(defaults) {
  _rowCounter += 1;
  return {
    id: `row-${_rowCounter}`,
    name: (defaults == null ? void 0 : defaults.name) ?? "",
    startQ: (defaults == null ? void 0 : defaults.startQ) ?? "",
    endQ: (defaults == null ? void 0 : defaults.endQ) ?? ""
  };
}
function CreateTemplate() {
  const navigate = useNavigate();
  const formId = reactExports.useId();
  const [name, setName] = reactExports.useState("");
  const [nameError, setNameError] = reactExports.useState("");
  const [levels, setLevels] = reactExports.useState(() => [
    newRow({ name: "Level 1", startQ: "1", endQ: "40" })
  ]);
  const [levelErrors, setLevelErrors] = reactExports.useState([{}]);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [submitError, setSubmitError] = reactExports.useState("");
  const { mutateAsync: createTemplate } = useCreateTemplate();
  const { actor } = useBackend();
  const addLevel = () => {
    const nextNum = levels.length + 1;
    setLevels((prev) => [...prev, newRow({ name: `Level ${nextNum}` })]);
    setLevelErrors((prev) => [...prev, {}]);
  };
  const removeLevel = (id) => {
    const idx = levels.findIndex((l) => l.id === id);
    setLevels((prev) => prev.filter((l) => l.id !== id));
    setLevelErrors((prev) => prev.filter((_, i) => i !== idx));
  };
  const updateLevel = (id, field, value) => {
    setLevels(
      (prev) => prev.map((l) => l.id === id ? { ...l, [field]: value } : l)
    );
    const idx = levels.findIndex((l) => l.id === id);
    if (idx !== -1) {
      setLevelErrors((prev) => prev.map((e, i) => i === idx ? {} : e));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    if (!name.trim()) {
      setNameError("Template name is required");
      hasError = true;
    } else {
      setNameError("");
    }
    const { valid, errors } = validateLevels(levels);
    setLevelErrors(errors);
    if (!valid) hasError = true;
    if (hasError) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const template = await createTemplate(name.trim());
      for (let idx = 0; idx < levels.length; idx++) {
        const level = levels[idx];
        if (!actor) throw new Error("Not connected");
        const result = await actor.addLevel(
          template.id,
          level.name.trim(),
          BigInt(Number.parseInt(level.startQ, 10)),
          BigInt(Number.parseInt(level.endQ, 10)),
          BigInt(idx)
        );
        if (result.__kind__ === "err") {
          throw new Error(result.err);
        }
      }
      navigate({ to: "/template/$id", params: { id: String(template.id) } });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto px-4 sm:px-6 py-8",
      "data-ocid": "create_template.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground font-body mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/" }),
              "data-ocid": "create_template.breadcrumb_home",
              className: "hover:text-foreground transition-smooth",
              children: "Templates"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "New Template" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground mb-8", children: "Create Template" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: formId, onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-display font-semibold text-foreground", children: "Template Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "template-name",
                  className: "text-sm font-body text-foreground",
                  children: [
                    "Template name ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "template-name",
                  "data-ocid": "create_template.name_input",
                  placeholder: "e.g. Electrostatics SBT",
                  value: name,
                  onChange: (e) => {
                    setName(e.target.value);
                    if (nameError) setNameError("");
                  },
                  autoFocus: true,
                  maxLength: 100,
                  className: cn(
                    nameError && "border-destructive focus-visible:ring-destructive"
                  )
                }
              ),
              nameError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  "data-ocid": "create_template.name_error",
                  className: "text-xs text-destructive flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3 shrink-0" }),
                    nameError
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-display font-semibold text-foreground", children: "Question Levels" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
                levels.length,
                " level",
                levels.length !== 1 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex flex-col gap-3",
                "data-ocid": "create_template.level_list",
                children: levels.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LevelRowItem,
                  {
                    row,
                    index: i + 1,
                    error: levelErrors[i] ?? {},
                    canRemove: levels.length > 1,
                    onChange: updateLevel,
                    onRemove: removeLevel
                  },
                  row.id
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: addLevel,
                "data-ocid": "create_template.add_level_button",
                className: "w-full gap-2 border-dashed",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  "Add Level"
                ]
              }
            )
          ] }),
          submitError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "create_template.submit_error_state",
              className: "flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0" }),
                submitError
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: () => navigate({ to: "/" }),
                "data-ocid": "create_template.cancel_button",
                disabled: isSubmitting,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: isSubmitting,
                "data-ocid": "create_template.submit_button",
                className: "gap-2 min-w-[140px]",
                children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" }),
                  "Creating…"
                ] }) : "Create Template"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  CreateTemplate as default
};
