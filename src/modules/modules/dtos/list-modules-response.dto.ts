import { Module } from "../entities/module.entity";

export class ListModuleResponse {
  modules: Module[];
  next?: boolean;
}