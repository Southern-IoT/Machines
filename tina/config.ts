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
                name: "function",
                label: "Function / Description",
                type: "string",
                ui: { component: "textarea" },
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
        ],
      },
    ],
  },
});
