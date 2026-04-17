"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GripVertical, Lock } from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";

const SECTION_KEYS = ["landing", "details", "photos", "wishes"] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

const ALWAYS_ON: SectionKey[] = ["landing", "details"];

const LABEL_KEYS: Record<SectionKey, string> = {
  landing: "builder.section_landing",
  details: "builder.section_details",
  photos: "builder.section_photos",
  wishes: "builder.section_wishes",
};

export function SectionsManagerSection() {
  const { t } = useTranslation();
  const sectionOrder = useEditorStore((s) => s.sectionOrder) as SectionKey[];
  const sectionsDisabled = useEditorStore((s) => s.sectionsDisabled);
  const setField = useEditorStore((s) => s.setField);

  const disabledSet = new Set(sectionsDisabled);

  const [dragOverKey, setDragOverKey] = useState<SectionKey | null>(null);
  const dragSrcKey = useRef<SectionKey | null>(null);

  // Ensure order contains all keys (handle migration from old events without sectionOrder)
  const order: SectionKey[] = [
    "landing",
    ...SECTION_KEYS.filter((k) => k !== "landing").sort(
      (a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b)
    ),
  ];

  function handleDragStart(key: SectionKey) {
    if (key === "landing") return;
    dragSrcKey.current = key;
  }

  function handleDragOver(e: React.DragEvent, key: SectionKey) {
    if (key === "landing" || !dragSrcKey.current || dragSrcKey.current === key) return;
    e.preventDefault();
    setDragOverKey(key);
  }

  function handleDrop(targetKey: SectionKey) {
    if (targetKey === "landing" || !dragSrcKey.current || dragSrcKey.current === targetKey) {
      dragSrcKey.current = null;
      setDragOverKey(null);
      return;
    }

    const src = dragSrcKey.current;
    const movable = order.filter((k) => k !== "landing") as SectionKey[];
    const srcIdx = movable.findIndex((k) => k === src);
    const tgtIdx = movable.findIndex((k) => k === targetKey);
    const next = [...movable];
    next.splice(srcIdx, 1);
    next.splice(tgtIdx, 0, src);

    setField("sectionOrder", ["landing", ...next]);
    dragSrcKey.current = null;
    setDragOverKey(null);
  }

  function handleDragEnd() {
    dragSrcKey.current = null;
    setDragOverKey(null);
  }

  function toggleSection(key: SectionKey) {
    const next = disabledSet.has(key)
      ? sectionsDisabled.filter((k) => k !== key)
      : [...sectionsDisabled, key];
    setField("sectionsDisabled", next);
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-800">{t("builder.sections_title")}</h3>
      <p className="text-xs text-gray-500">
        {t("builder.section_pinned")}:{" "}
        <span className="font-medium">{t("builder.section_landing")}</span>
      </p>

      <div className="space-y-2">
        {order.map((key) => {
          const isLanding = key === "landing";
          const alwaysOn = ALWAYS_ON.includes(key);
          const isDisabled = disabledSet.has(key);
          const isDragTarget = dragOverKey === key;

          return (
            <div
              key={key}
              draggable={!isLanding}
              onDragStart={() => handleDragStart(key)}
              onDragOver={(e) => handleDragOver(e, key)}
              onDrop={() => handleDrop(key)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors ${
                isDragTarget
                  ? "border-gray-400 bg-gray-100"
                  : "border-gray-200 bg-white"
              } ${isLanding ? "opacity-70" : "cursor-grab active:cursor-grabbing"}`}
            >
              {/* Drag handle or lock */}
              <span className="text-gray-400">
                {isLanding ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <GripVertical className="h-4 w-4" />
                )}
              </span>

              {/* Section name */}
              <span className="flex-1 text-sm font-medium text-gray-800">
                {t(LABEL_KEYS[key])}
              </span>

              {/* Toggle or always-on badge */}
              {alwaysOn ? (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400">
                  {t("builder.section_always_on")}
                </span>
              ) : (
                <button
                  type="button"
                  role="switch"
                  aria-checked={!isDisabled}
                  onClick={() => toggleSection(key)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                    isDisabled ? "bg-gray-200" : "bg-gray-800"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform ${
                      isDisabled ? "translate-x-0" : "translate-x-4"
                    }`}
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
