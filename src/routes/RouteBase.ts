import express from 'express';
export interface RouteBase {
    routeName: string;
    routeObject: express.Router;
    initRoutes: () => void;
}