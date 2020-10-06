import { Router } from 'express';

import UsersRouter from '@modules/users/infra/http/routes/users.routes';
import ProfileRouter from '@modules/users/infra/http/routes/profile.routes';
import SessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import PasswordRouter from '@modules/users/infra/http/routes/password.routes';
import ProvidersRouter from '@modules/appointments/infra/http/routes/providers.routes';
import AppointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';

const routes = Router();

routes.use('/users', UsersRouter);
routes.use('/profile', ProfileRouter);
routes.use('/sessions', SessionsRouter);
routes.use('/password', PasswordRouter);
routes.use('/providers', ProvidersRouter);
routes.use('/appointments', AppointmentsRouter);

export default routes;
