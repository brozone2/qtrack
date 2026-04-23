import { j as jsxRuntimeExports, B as Button, c as cn } from "./index-PxEetNKB.js";
function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  "data-ocid": dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": dataOcid,
      className: cn(
        "flex flex-col items-center justify-center gap-3 py-16 px-6 text-center",
        className
      ),
      children: [
        icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground/50 text-4xl mb-1", children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-display font-semibold text-foreground", children: title }),
        description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-muted-foreground max-w-xs leading-relaxed", children: description }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            onClick: action.onClick,
            "data-ocid": `${dataOcid ?? "empty_state"}.action_button`,
            className: "mt-2",
            children: action.label
          }
        )
      ]
    }
  );
}
function ProgressBar({
  label,
  count,
  total,
  colorClass = "bg-primary",
  className
}) {
  const pct = total === 0 ? 0 : Math.round(count / total * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-col gap-1", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-foreground shrink-0 ml-2", children: [
        count,
        "/",
        total,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-1", children: [
          "(",
          pct,
          "%)"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-1.5 rounded-full bg-secondary overflow-hidden",
        "aria-label": `${label}: ${pct}%`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "h-full rounded-full transition-all duration-500",
              colorClass
            ),
            style: { width: `${pct}%` }
          }
        )
      }
    )
  ] });
}
export {
  EmptyState as E,
  ProgressBar as P
};
