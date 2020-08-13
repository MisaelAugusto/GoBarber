import { Router } from 'express';
import UsersRouter from './users.routes';
import SessionsRouter from './sessions.routes';
import AppointmentsRouter from './appointments.routes';

const routes = Router();

routes.use('/users', UsersRouter);
routes.use('/sessions', SessionsRouter);
routes.use('/appointments', AppointmentsRouter);

export default routes;
