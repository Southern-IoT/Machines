import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.GITHUB_BRANCH || "main",
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: "Machines",
  },

  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "partsLibrary",
        label: "Parts Image Library",
        path: "src/content/parts-library",
        format: "json",
        ui: {
          filename: {
            readonly: false,
            slugify: (values: Record<string, any>) => {
              // Use the explicit `key` field if set, otherwise build one
              // from brand + partId (or brand + slugified partName as fallback).
              const explicit = (values?.key || "").toString().trim();
              if (explicit) {
                return explicit
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
              }
              const brand = (values?.brand || "").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-");
              const partId = (values?.partId || "").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-");
              const partName = (values?.partName || "")
                .toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
              const tail = partId && partId.length > 0 ? partId : partName;
              if (!brand) return "untitled";
              if (!tail) return brand;
              return `${brand}-${tail}`;
            },
          },
        },
        fields: [
          {
            name: "key",
            label: "Part Key (auto-generated from filename)",
            type: "string",
            required: true,
            description:
              "Filename slug. Format: <brand>-<partId-or-slug>. Example: juki-m-027 or juki-thrust-collar. Auto-generated — usually you don't need to edit this.",
            isTitle: true,
          },
          {
            name: "brand",
            label: "Brand",
            type: "string",
            required: true,
            description: "Manufacturer brand. Example: JUKI, Brother, Kansai Special.",
          },
          {
            name: "partId",
            label: "Official Component ID",
            type: "string",
            description:
              "As printed in the parts catalog. Example: M-027, U-178. Leave empty if the part has no Component ID.",
          },
          {
            name: "partName",
            label: "Canonical Part Name",
            type: "string",
            required: true,
            description:
              "The standard name used across all machines that share this part. Example: Crank, Needle Bar, Presser Foot.",
          },
          {
            name: "image",
            label: "Part Image",
            type: "image",
            description:
              "Exploded-view or product photo. PNG / JPG / JPEG / WebP. One image per part. This is the image shown when users click a part name on any machine page.",
          },
          {
            name: "notes",
            label: "Notes (optional)",
            type: "string",
            ui: { component: "textarea" },
            description:
              "Any caveats — e.g. 'Used in MO-6800D and MO-6814D variants only' or 'Same physical part as B-118, just renumbered'.",
          },
        ],
      },
      {
        name: "machine",
        label: "Machines",
        path: "src/content/machines",
        format: "json",
        ui: {
          filename: {
            readonly: false,
            slugify: (values: Record<string, any>) => {
              return (values?.title || "untitled")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            },
          },
        },
        fields: [
          {
            name: "title",
            label: "Machine Model / Name",
            type: "string",
            required: true,
            isTitle: true,
          },
          {
            name: "subtitle",
            label: "Machine Type / Short Description",
            type: "string",
          },
          {
            name: "brand",
            label: "Brand / Manufacturer",
            type: "string",
          },
          {
            name: "category",
            label: "Category",
            type: "string",
            options: [
              "Sewing Machine",
              "Chain Stitch Machine",
              "Cylinder Bed Sewing Machine",
              "Cutting Machine",
              "Pressing Machine",
              "Fusing Machine",
              "Spreading Machine",
              "Inspection Machine",
              "Bartacking Machine",
              "Overlock Machine",
              "Button Attaching Machine",
              "Buttonhole Machine",
              "Embroidery Machine",
              "Other",
            ],
          },
          {
            name: "machineImage",
            label: "Machine Image",
            type: "image",
          },
          {
            name: "reportDownloadUrl",
            label: "Report Download URL (Google Drive link)",
            type: "string",
          },
          {
            name: "publishedDate",
            label: "Published Date",
            type: "datetime",
          },
          {
            name: "purposeAndApplication",
            label: "Purpose & Application",
            type: "object",
            fields: [
              {
                name: "purpose",
                label: "Purpose",
                type: "string",
                ui: { component: "textarea" },
              },
              {
                name: "applications",
                label: "Applications",
                type: "string",
                list: true,
              },
              {
                name: "industry",
                label: "Industry / Sector",
                type: "string",
              },
            ],
          },

          // ─── OVERVIEW ───
          {
            name: "overviewDescription",
            label: "Overview Description",
            type: "string",
            ui: { component: "textarea" },
          },
          {
            name: "classificationTable",
            label: "Machine Classification / Overview Table",
            type: "object",
            list: true,
            ui: {
              itemProps: (item: Record<string, any>) => ({
                label: item?.field || "Field",
              }),
            },
            fields: [
              { name: "field", label: "Field Name", type: "string" },
              { name: "value", label: "Field Value", type: "string" },
            ],
          },

          // ─── TECHNICAL SPECS ───
          {
            name: "technicalSpecs",
            label: "Technical Specifications",
            type: "object",
            list: true,
            ui: {
              itemProps: (item: Record<string, any>) => ({
                label: item?.parameter || "Spec",
              }),
            },
            fields: [
              { name: "parameter", label: "Parameter", type: "string" },
              { name: "value", label: "Value / Specification", type: "string" },
            ],
          },

          // ─── WORKING PRINCIPLES ───
          {
            name: "workingPrinciples",
            label: "Working Principles",
            type: "object",
            list: true,
            ui: {
              itemProps: (item: Record<string, any>) => ({
                label: item?.heading || "Principle",
              }),
            },
            fields: [
              { name: "heading", label: "Principle Title", type: "string" },
              {
                name: "description",
                label: "Description",
                type: "string",
                ui: { component: "textarea" },
              },
              {
                name: "componentIds",
                label: "Component IDs (referenced in this principle)",
                type: "string",
                list: true,
                description: "List of part IDs from the parts list that are involved in this principle.",
              },
            ],
          },

          // ─── SEQUENCE FLOW ───
          {
            name: "sequenceFlow",
            label: "Operational Sequence Steps",
            type: "object",
            list: true,
            ui: {
              itemProps: (item: Record<string, any>) => ({
                label: item?.stepTitle || "Step",
              }),
            },
            fields: [
              { name: "stepTitle", label: "Step Title", type: "string" },
              {
                name: "stepDescription",
                label: "Step Description",
                type: "string",
              },
            ],
          },

          // ─── PARTS LIST ───
          {
            name: "partsList",
            label: "Parts List",
            type: "object",
            list: true,
            ui: {
              itemProps: (item: Record<string, any>) => ({
                label: item?.partName || "Part",
              }),
            },
            fields: [
              { name: "partName", label: "Part Name", type: "string" },
              {
                name: "partId",
                label: "Part ID / Component ID",
                type: "string",
              },
              {
                name: "section",
                label: "Section (mechanical / electronic)",
                type: "string",
                options: ["mechanical", "electronic"],
              },
              {
                name: "category",
                label: "Parts Category (catalog group)",
                type: "string",
                description:
                  "Catalog group such as Drive & Transmission, Cutting Assembly, Motor & Electrical, Fasteners & Hardware, etc.",
              },
              {
                name: "qty",
                label: "Quantity per machine",
                type: "string",
                description: "As printed in the parts catalog (e.g. 1, 2, 4, as needed).",
              },
              {
                name: "material",
                label: "Material",
                type: "string",
                description:
                  "Material as listed in catalog (e.g. High Speed Steel, Cast Iron). Empty if not listed.",
              },
              {
                name: "function",
                label: "Function / Description",
                type: "string",
                ui: { component: "textarea" },
              },
              {
                name: "verified",
                label: "Verification flag",
                type: "string",
                options: ["✅", "⚠️", "❌", "📋", "🔴"],
                description:
                  "✅ = 2+ official sources · ⚠️ = 1 official source · ❌ = sources conflict · 📋 = manual only · 🔴 = unverified",
              },
              {
                name: "source",
                label: "Source URL",
                type: "string",
                description: "URL of the official catalog/manual page that documents this part.",
              },
            ],
          },

          // ─── MAINTENANCE & ERROR CODES ───
          {
            name: "maintenance",
            label: "Maintenance & Troubleshooting",
            type: "object",
            list: true,
            ui: {
              itemProps: (item: Record<string, any>) => ({
                label: item?.code || "Issue",
              }),
            },
            fields: [
              {
                name: "code",
                label: "Error Code / Symptom",
                type: "string",
              },
              {
                name: "definition",
                label: "Definition / Possible Cause",
                type: "string",
              },
              {
                name: "action",
                label: "Corrective Action",
                type: "string",
              },
              {
                name: "flag",
                label: "Source flag (optional)",
                type: "string",
                description:
                  "Leave blank for entries in the official manual. Use '⚠️ Field Reported' for known field issues not in the manual.",
              },
            ],
          },

          // ─── RESOURCES ───
          {
            name: "resources",
            label: "Additional Resources",
            type: "object",
            list: true,
            ui: {
              itemProps: (item: Record<string, any>) => ({
                label: item?.resourceName || "Resource",
              }),
            },
            fields: [
              {
                name: "resourceName",
                label: "Resource Name",
                type: "string",
              },
              {
                name: "description",
                label: "Description / Use",
                type: "string",
              },
              { name: "url", label: "URL", type: "string" },
            ],
          },

          // ─── FINAL NOTES ───
          {
            name: "finalNotes",
            label: "Final Notes / Important Information",
            type: "string",
            ui: { component: "textarea" },
          },

          // ─── GAUGE / PARTS CROSS REFERENCE (Optional) ───
          {
            name: "gaugePartsCrossReference",
            label: "Gauge / Parts Cross Reference (Optional)",
            type: "object",
            list: true,
            ui: {
              itemProps: (item: Record<string, any>) => ({
                label: item?.gaugeCode || "Gauge",
              }),
            },
            fields: [
              {
                name: "gaugeCode",
                label: "Gauge Code",
                type: "string",
              },
              {
                name: "description",
                label: "Description / Material Type",
                type: "string",
              },
              {
                name: "needles",
                label: "Recommended Needles",
                type: "string",
              },
              {
                name: "needleGauge",
                label: "Needle Gauge",
                type: "string",
              },
              {
                name: "presserFoot",
                label: "Presser Foot",
                type: "string",
              },
              {
                name: "feedDog",
                label: "Feed Dog",
                type: "string",
              },
            ],
          },

          // ─── PARTS CATALOG META (Required for researched machines) ───
          {
            name: "partsMeta",
            label: "Parts Catalog Meta",
            type: "object",
            description:
              "Provenance of the parts list. Required for new machines researched via the /research skill.",
            fields: [
              {
                name: "totalParts",
                label: "Total Parts Documented",
                type: "number",
              },
              {
                name: "catalogSource",
                label: "Official Catalog Source URL",
                type: "string",
              },
              {
                name: "catalogVersion",
                label: "Catalog Version / Date",
                type: "string",
              },
              {
                name: "lastVerified",
                label: "Last Verified (ISO date)",
                type: "datetime",
              },
            ],
          },
        ],
      },
    ],
  },
});
