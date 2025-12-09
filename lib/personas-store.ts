import { Persona } from "./personas";
import { personas as defaultPersonas } from "./personas";

// Shared in-memory store for personas
// In production, this would be replaced with database operations
let personasStore: Persona[] = [...defaultPersonas];

export function getPersonas(): Persona[] {
  return [...personasStore];
}

export function getPersonaById(id: string): Persona | undefined {
  return personasStore.find((p) => p.id === id);
}

export function addPersona(persona: Persona): void {
  personasStore.push(persona);
}

export function updatePersona(id: string, updates: Partial<Persona>): boolean {
  const index = personasStore.findIndex((p) => p.id === id);
  if (index === -1) return false;
  personasStore[index] = { ...personasStore[index], ...updates };
  return true;
}

export function deletePersona(id: string): boolean {
  const index = personasStore.findIndex((p) => p.id === id);
  if (index === -1) return false;
  personasStore.splice(index, 1);
  return true;
}

export function resetPersonas(): void {
  personasStore = [...defaultPersonas];
}

