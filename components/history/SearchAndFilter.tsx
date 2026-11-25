"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Calendar, Bot } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SearchFilters {
  query: string;
  dateRange: "all" | "today" | "yesterday" | "thisWeek" | "older";
  model: string | null;
}

interface SearchAndFilterProps {
  onFiltersChange: (filters: SearchFilters) => void;
  availableModels: Array<{ id: string; model_name: string }>;
  totalCount: number;
  filteredCount: number;
}

export function SearchAndFilter({
  onFiltersChange,
  availableModels,
  totalCount,
  filteredCount,
}: SearchAndFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    dateRange: "all",
    model: null,
  });

  const handleQueryChange = (query: string) => {
    const newFilters = { ...filters, query };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (dateRange: SearchFilters["dateRange"]) => {
    const newFilters = { ...filters, dateRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleModelChange = (model: string | null) => {
    const newFilters = { ...filters, model };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      query: "",
      dateRange: "all" as const,
      model: null,
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = filters.query || filters.dateRange !== "all" || filters.model;

  const dateRangeOptions = [
    { value: "all", label: "Todas las fechas" },
    { value: "today", label: "Hoy" },
    { value: "yesterday", label: "Ayer" },
    { value: "thisWeek", label: "Esta semana" },
    { value: "older", label: "Más antiguas" },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar conversaciones..."
          value={filters.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {filters.query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => handleQueryChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Date Range Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Calendar className="h-4 w-4 mr-2" />
              {dateRangeOptions.find(opt => opt.value === filters.dateRange)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Rango de fechas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {dateRangeOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleDateRangeChange(option.value as SearchFilters["dateRange"])}
                className={filters.dateRange === option.value ? "bg-accent" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Model Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Bot className="h-4 w-4 mr-2" />
              {filters.model 
                ? availableModels.find(m => m.id === filters.model)?.model_name || "Modelo"
                : "Todos los modelos"
              }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Modelo de IA</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleModelChange(null)}
              className={!filters.model ? "bg-accent" : ""}
            >
              Todos los modelos
            </DropdownMenuItem>
            {availableModels.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                className={filters.model === model.id ? "bg-accent" : ""}
              >
                {model.model_name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </Button>
        )}

        {/* Results Count */}
        <div className="ml-auto">
          <Badge variant="secondary" className="text-xs">
            {filteredCount} de {totalCount} conversaciones
          </Badge>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.query && (
            <Badge variant="secondary" className="text-xs">
              Búsqueda: &ldquo;{filters.query}&rdquo;
            </Badge>
          )}
          {filters.dateRange !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Fecha: {dateRangeOptions.find(opt => opt.value === filters.dateRange)?.label}
            </Badge>
          )}
          {filters.model && (
            <Badge variant="secondary" className="text-xs">
              Modelo: {availableModels.find(m => m.id === filters.model)?.model_name}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
