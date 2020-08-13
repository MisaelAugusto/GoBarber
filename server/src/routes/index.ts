import { Router } from 'express';
import UsersRouter from './users.routes';
import AppointmentsRouter from './appointments.routes';

const routes = Router();

routes.use('/users', UsersRouter);
routes.use('/appointments', AppointmentsRouter);

export default routes;
