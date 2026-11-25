"use client";

import { useState, useMemo } from "react";
import { type GroupedConversations } from "@/lib/history";
import { ConversationRow } from "./ConversationRow";
import { SearchAndFilter, type SearchFilters } from "./SearchAndFilter";

export function ConversationTable({
  conversations: initialConversations,
}: {
  conversations: GroupedConversations;
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    dateRange: "all",
    model: null,
  });

  // Get all conversations for filtering
  const allConversations = useMemo(() => {
    return [
      ...conversations.today,
      ...conversations.yesterday,
      ...conversations.thisWeek,
      ...conversations.older,
    ];
  }, [conversations]);

  // Get available models from conversations
  const availableModels = useMemo(() => {
    const modelSet = new Set<string>();
    allConversations.forEach(conv => {
      if (conv.model_name) {
        modelSet.add(conv.model_name);
      }
    });
    return Array.from(modelSet).map(name => ({ id: name, model_name: name }));
  }, [allConversations]);

  // Filter conversations based on current filters
  const filteredConversations = useMemo(() => {
    let filtered = allConversations;

    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.title?.toLowerCase().includes(query) ||
        conv.model_name?.toLowerCase().includes(query)
      );
    }

    // Filter by model
    if (filters.model) {
      filtered = filtered.filter(conv => conv.model_name === filters.model);
    }

    // Filter by date range
    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(thisWeekStart.getDate() - today.getDay());

      filtered = filtered.filter(conv => {
        const convDate = new Date(conv.created_at);
        
        switch (filters.dateRange) {
          case "today":
            return convDate >= today;
          case "yesterday":
            return convDate >= yesterday && convDate < today;
          case "thisWeek":
            return convDate >= thisWeekStart && convDate < today;
          case "older":
            return convDate < thisWeekStart;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [allConversations, filters]);

  // Group filtered conversations back into sections
  const groupedFilteredConversations = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - today.getDay());

    const grouped = {
      today: [] as typeof allConversations,
      yesterday: [] as typeof allConversations,
      thisWeek: [] as typeof allConversations,
      older: [] as typeof allConversations,
    };

    filteredConversations.forEach(conv => {
      const convDate = new Date(conv.created_at);
      
      if (convDate >= today) {
        grouped.today.push(conv);
      } else if (convDate >= yesterday) {
        grouped.yesterday.push(conv);
      } else if (convDate >= thisWeekStart) {
        grouped.thisWeek.push(conv);
      } else {
        grouped.older.push(conv);
      }
    });

    return grouped;
  }, [filteredConversations]);

  const sections = [
    { key: "today", title: "Hoy", data: groupedFilteredConversations.today },
    { key: "yesterday", title: "Ayer", data: groupedFilteredConversations.yesterday },
    { key: "thisWeek", title: "Esta semana", data: groupedFilteredConversations.thisWeek },
    { key: "older", title: "Más antiguas", data: groupedFilteredConversations.older },
  ].filter((section) => section.data.length > 0);

  const handleConversationRenamed = (
    conversationId: string,
    newTitle: string
  ) => {
    setConversations((prev) => {
      // Find which category contains the conversation and update only that one
      const categories = ["today", "yesterday", "thisWeek", "older"] as const;

      for (const category of categories) {
        const categoryConversations = prev[category];
        const conversationIndex = categoryConversations.findIndex(
          (conv) => conv.id === conversationId
        );

        if (conversationIndex !== -1) {
          return {
            ...prev,
            [category]: categoryConversations.map((conv, index) =>
              index === conversationIndex ? { ...conv, title: newTitle } : conv
            ),
          };
        }
      }

      // Conversation not found (shouldn't happen), return unchanged
      return prev;
    });
  };

  const handleConversationDeleted = (conversationId: string) => {
    setConversations((prev) => {
      // Find which category contains the conversation and remove from only that one
      const categories = ["today", "yesterday", "thisWeek", "older"] as const;

      for (const category of categories) {
        const categoryConversations = prev[category];
        const conversationIndex = categoryConversations.findIndex(
          (conv) => conv.id === conversationId
        );

        if (conversationIndex !== -1) {
          return {
            ...prev,
            [category]: categoryConversations.filter(
              (conv) => conv.id !== conversationId
            ),
          };
        }
      }

      // Conversation not found (shouldn't happen), return unchanged
      return prev;
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Component */}
      <SearchAndFilter
        onFiltersChange={setFilters}
        availableModels={availableModels}
        totalCount={allConversations.length}
        filteredCount={filteredConversations.length}
      />

      <div className="rounded-md border">
        {/* Table Header */}
        <div className="border-b bg-muted/50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-medium text-muted-foreground">
            <div>Nombre</div>
            <div className="hidden md:block">Fecha</div>
            <div className="hidden md:block">Modelo</div>
          </div>
        </div>

        {/* Conversation Sections */}
        <div className="divide-y">
          {sections.map((section) => (
            <div key={section.key}>
              {/* Section Header */}
              <div className="bg-muted/25 px-4 py-2 border-b">
                <h3 className="text-sm font-medium text-foreground">
                  {section.title}
                </h3>
              </div>

              {/* Section Conversations */}
              <div className="divide-y">
                {section.data.map((conversation) => (
                  <ConversationRow
                    key={conversation.id}
                    conversation={conversation}
                    onRenamed={handleConversationRenamed}
                    onDeleted={handleConversationDeleted}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
