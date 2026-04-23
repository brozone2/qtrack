import { j as jsxRuntimeExports, c as cn, u as useNavigate, B as Button } from "./index-PxEetNKB.js";
import { u as useBackend, a as useQuery } from "./useBackend-CH7lR8h_.js";
import { E as EmptyState, P as ProgressBar } from "./ProgressBar-DMUdzkXb.js";
import { c as createLucideIcon, u as useTemplates, P as Plus } from "./useTemplates-HpVsIlc1.js";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode);
var QuestionStatus = /* @__PURE__ */ ((QuestionStatus2) => {
  QuestionStatus2["Incorrect"] = "Incorrect";
  QuestionStatus2["Correct"] = "Correct";
  QuestionStatus2["Unattempted"] = "Unattempted";
  QuestionStatus2["Revisit"] = "Revisit";
  return QuestionStatus2;
})(QuestionStatus || {});
function TemplateCard({ template, index, onClick }) {
  const { actor, isFetching } = useBackend();
  const { data: levels } = useQuery({
    queryKey: ["levels", String(template.id)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplateLevels(template.id);
    },
    enabled: !!actor && !isFetching
  });
  const { data: records } = useQuery({
    queryKey: ["records", String(template.id)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplateRecords(template.id);
    },
    enabled: !!actor && !isFetching
  });
  const totalQuestions = (levels == null ? void 0 : levels.reduce(
    (acc, l) => acc + Number(l.endQuestion - l.startQuestion + 1n),
    0
  )) ?? 0;
  const attempted = (records == null ? void 0 : records.filter((r) => r.status !== QuestionStatus.Unattempted).length) ?? 0;
  const correct = (records == null ? void 0 : records.filter((r) => r.status === QuestionStatus.Correct).length) ?? 0;
  const levelCount = (levels == null ? void 0 : levels.length) ?? 0;
  const createdDate = new Date(
    Number(template.createdAt) / 1e6
  ).toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": `dashboard.template_card.${index}`,
      className: "group text-left bg-card border border-border rounded-xl p-5 flex flex-col gap-4 transition-smooth hover:border-primary/40 hover:shadow-elevated active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[160px]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-base leading-snug truncate", children: template.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 font-body", children: createdDate })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-primary" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs font-body text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3.5 h-3.5" }),
            levelCount === 0 ? "—" : `${levelCount} level${levelCount !== 1 ? "s" : ""}`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3.5 h-3.5" }),
            totalQuestions === 0 ? "—" : `${totalQuestions} questions`
          ] })
        ] }),
        totalQuestions > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 mt-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProgressBar,
            {
              label: "Attempted",
              count: attempted,
              total: totalQuestions,
              colorClass: "bg-primary"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProgressBar,
            {
              label: "Correct",
              count: correct,
              total: totalQuestions,
              colorClass: "bg-status-solved"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-auto font-body italic", children: "No levels added yet" })
      ]
    }
  );
}
function TemplateCardSkeleton({ index }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `dashboard.template_skeleton.${index}`,
      className: "bg-card border border-border rounded-xl p-5 flex flex-col gap-4 min-h-[160px]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/3" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-8 h-8 rounded-lg shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 mt-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2 w-full rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2 w-full rounded-full" })
        ] })
      ]
    }
  );
}
function Dashboard() {
  const { data: templates, isLoading } = useTemplates();
  const navigate = useNavigate();
  const handleNew = () => navigate({ to: "/template/new" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-7xl mx-auto px-4 sm:px-6 py-8",
      "data-ocid": "dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "My Templates" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-0.5", children: "Track your question progress by chapter or book" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleNew,
              "data-ocid": "dashboard.new_template_button",
              className: "gap-2 shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "New Template" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "New" })
              ]
            }
          )
        ] }),
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
            "data-ocid": "dashboard.loading_state",
            children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TemplateCardSkeleton, { index: i }, i))
          }
        ),
        !isLoading && (!templates || templates.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-20 px-6",
            "data-ocid": "dashboard.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                EmptyState,
                {
                  title: "No templates yet",
                  description: "Create a template for a book or chapter, define question ranges, and start tracking your progress.",
                  action: { label: "Create your first template", onClick: handleNew },
                  className: "py-0"
                }
              )
            ]
          }
        ),
        !isLoading && templates && templates.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
            "data-ocid": "dashboard.template_list",
            children: templates.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              TemplateCard,
              {
                template: t,
                index: i + 1,
                onClick: () => navigate({ to: "/template/$id", params: { id: String(t.id) } })
              },
              String(t.id)
            ))
          }
        )
      ]
    }
  );
}
export {
  Dashboard as default
};
