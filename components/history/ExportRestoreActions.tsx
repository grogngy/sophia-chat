"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Upload, FileText, FileJson } from "lucide-react";
import { toast } from "sonner";
import { 
  exportConversationsToJSON, 
  exportConversationsToMarkdown,
  generateExportFilename,
  downloadAsFile,
  type ConversationWithMessages
} from "@/lib/conversation-export";
import { importConversations, getConversationsForExport } from "@/app/actions/import";
import { type GroupedConversations } from "@/lib/history";

interface ExportRestoreActionsProps {
  conversations: GroupedConversations;
}

export function ExportRestoreActions({ 
  conversations
}: ExportRestoreActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Get all conversation IDs for export
  const allConversationIds = [
    ...conversations.today,
    ...conversations.yesterday,
    ...conversations.thisWeek,
    ...conversations.older,
  ].map(conv => conv.id);

  const handleExportJSON = async () => {
    if (allConversationIds.length === 0) {
      toast.error("No hay conversaciones para exportar");
      return;
    }

    setIsExporting(true);
    try {
      const result = await getConversationsForExport(allConversationIds);
      
      if (!result.success || !result.conversations) {
        toast.error(result.error || "Error al obtener conversaciones");
        return;
      }

      const jsonData = exportConversationsToJSON(result.conversations as ConversationWithMessages[]);
      const filename = generateExportFilename("json");
      
      downloadAsFile(jsonData, filename, "application/json");
      toast.success("Conversaciones exportadas exitosamente");
    } catch (error) {
      console.error("Error exporting conversations:", error);
      toast.error("Error al exportar conversaciones");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMarkdown = async () => {
    if (allConversationIds.length === 0) {
      toast.error("No hay conversaciones para exportar");
      return;
    }

    setIsExporting(true);
    try {
      const result = await getConversationsForExport(allConversationIds);
      
      if (!result.success || !result.conversations) {
        toast.error(result.error || "Error al obtener conversaciones");
        return;
      }

      const markdownData = exportConversationsToMarkdown(result.conversations as ConversationWithMessages[]);
      const filename = generateExportFilename("md");
      
      downloadAsFile(markdownData, filename, "text/markdown");
      toast.success("Conversaciones exportadas exitosamente");
    } catch (error) {
      console.error("Error exporting conversations:", error);
      toast.error("Error al exportar conversaciones");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/json" || file.name.endsWith('.json')) {
        setImportFile(file);
      } else {
        toast.error("Por favor selecciona un archivo JSON válido");
      }
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Por favor selecciona un archivo para importar");
      return;
    }

    setIsImporting(true);
    try {
      const text = await importFile.text();
      const result = await importConversations(text);

      if (result.success) {
        toast.success(result.message || `Se importaron ${result.importedCount} conversaciones`);
        setShowImportDialog(false);
        setImportFile(null);
        // Reload the page to show the imported conversations
        window.location.reload();
      } else {
        toast.error(result.errors.join(", "));
      }
    } catch (error) {
      console.error("Error importing conversations:", error);
      toast.error("Error al importar conversaciones");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Export JSON */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportJSON}
        disabled={isExporting || allConversationIds.length === 0}
        className="h-8"
      >
        <Download className="h-4 w-4 mr-2" />
        {isExporting ? "Exportando..." : "Exportar JSON"}
      </Button>

      {/* Export Markdown */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportMarkdown}
        disabled={isExporting || allConversationIds.length === 0}
        className="h-8"
      >
        <FileText className="h-4 w-4 mr-2" />
        {isExporting ? "Exportando..." : "Exportar MD"}
      </Button>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Upload className="h-4 w-4 mr-2" />
            Restaurar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restaurar Conversaciones</DialogTitle>
            <DialogDescription>
              Importa conversaciones desde un archivo de exportación de Sophia.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-file">Archivo de exportación</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                disabled={isImporting}
              />
              <p className="text-xs text-muted-foreground">
                Selecciona un archivo JSON exportado desde Sophia
              </p>
            </div>

            {importFile && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileJson className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{importFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(importFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowImportDialog(false)}
                disabled={isImporting}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={!importFile || isImporting}
              >
                {isImporting ? "Importando..." : "Importar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
