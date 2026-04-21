"use client";

import { useTranslation } from "react-i18next";
import { useEditorStore } from "@/stores/editorStore";
import { Input } from "@/components/ui/input";

export function JemputanSection() {
  const { t } = useTranslation();
  const invitationFatherBride = useEditorStore((s) => s.invitationFatherBride);
  const invitationMotherBride = useEditorStore((s) => s.invitationMotherBride);
  const invitationFatherGroom = useEditorStore((s) => s.invitationFatherGroom);
  const invitationMotherGroom = useEditorStore((s) => s.invitationMotherGroom);
  const invitationBrideName = useEditorStore((s) => s.invitationBrideName);
  const invitationGroomName = useEditorStore((s) => s.invitationGroomName);
  const invitationWording = useEditorStore((s) => s.invitationWording);
  const setField = useEditorStore((s) => s.setField);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{t("builder.section_jemputan")}</h3>
      <div className="space-y-3">
        <p className="text-xs text-gray-500">{t("builder.jemputan_bride_side")}</p>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.jemputan_father_bride")}</label>
          <Input
            value={invitationFatherBride}
            onChange={(e) => setField("invitationFatherBride", e.target.value)}
            placeholder={t("builder.jemputan_parent_placeholder")}
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.jemputan_mother_bride")}</label>
          <Input
            value={invitationMotherBride}
            onChange={(e) => setField("invitationMotherBride", e.target.value)}
            placeholder={t("builder.jemputan_parent_placeholder")}
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.jemputan_bride_name")}</label>
          <Input
            value={invitationBrideName}
            onChange={(e) => setField("invitationBrideName", e.target.value)}
            placeholder={t("builder.jemputan_bride_name_placeholder")}
            maxLength={100}
          />
        </div>

        <p className="pt-1 text-xs text-gray-500">{t("builder.jemputan_groom_side")}</p>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.jemputan_father_groom")}</label>
          <Input
            value={invitationFatherGroom}
            onChange={(e) => setField("invitationFatherGroom", e.target.value)}
            placeholder={t("builder.jemputan_parent_placeholder")}
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.jemputan_mother_groom")}</label>
          <Input
            value={invitationMotherGroom}
            onChange={(e) => setField("invitationMotherGroom", e.target.value)}
            placeholder={t("builder.jemputan_parent_placeholder")}
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.jemputan_groom_name")}</label>
          <Input
            value={invitationGroomName}
            onChange={(e) => setField("invitationGroomName", e.target.value)}
            placeholder={t("builder.jemputan_groom_name_placeholder")}
            maxLength={100}
          />
        </div>

        <div className="space-y-2 pt-1">
          <label className="text-xs font-medium text-gray-600">{t("builder.jemputan_wording")}</label>
          <textarea
            value={invitationWording}
            onChange={(e) => setField("invitationWording", e.target.value)}
            placeholder={t("builder.jemputan_wording_hint")}
            maxLength={1000}
            rows={4}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>
    </section>
  );
}
