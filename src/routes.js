const express = require('express');

//middleware
const upload = require('./utils/multer');
const authMiddleware = require('./middlewares/auth');
const authMiddlewareAdm = require('./middlewares/authAdm');
const authMiddlewareMod = require('./middlewares/authMod');
const authMiddlewarePodcaster = require('./middlewares/authPodcaster');
//middleware

//chamando os controllers
const UserController = require('./controllers/UserController');
const TipoUser = require('./controllers/TipoUsuarioController');
const Categoria = require('./controllers/CategoriaController');
const PodCast = require('./controllers/PodCastController');
const PodcastCategoria = require('./controllers/PodcastCategoriaController');
const Endereco = require('./controllers/EnderecoController');
const Tag = require('./controllers/TagController');
const PodcastProcedure = require('./controllers/PodcastProcedureController');
const SolicitacaoCadastro = require('./controllers/SolicitacaoCadastroController');
const SessionController = require('./controllers/SessionController');
//final chamando os controllers

//chamndo os validators
const UserStoreValidate = require('./validators/UserStore').validation;
//final validators

const { date } = require('./utils/Date');

const routes = express.Router();

//GERAL
routes.post('/sessions', SessionController.store);

routes.get('/categoria', Categoria.index);
routes.get('/podcasts', PodCast.index);
routes.get('/podcastctg/:pod_id', PodcastCategoria.indexCtgByPodcastID);
routes.get('/pesquisar/:ctg_id', PodcastCategoria.indexPodcastByCtgID);
routes.get('/pesquisar/nome/:ctg_id', PodcastCategoria.indexPodcastByCtgNome);
//routes.post('/podcastctg', PodcastCategoria.store);
routes.get('/endereco', Endereco.index);
//routes.post('/endereco', Endereco.store);
routes.get('/tag', Tag.index);
routes.post('/users', UserStoreValidate, UserController.store);
//FIM GERAL

//USUÁRIO LOGADO
routes.put('/edituser/', authMiddleware, UserController.updateUserPerfil);
routes.put('/usersenha/', authMiddleware, UserController.updateUserSenha);
//FIM USUARIO LOGADO

//PODCASTER
routes.post(
	'/podcast',
	authMiddlewarePodcaster,
	upload.single('file'),
	PodcastProcedure.store
);
routes.put(
	'/podcast/:pod_id',
	authMiddlewarePodcaster,
	PodcastProcedure.update
);
routes.put(
	'/podcastimg/:pod_id',
	authMiddlewarePodcaster,
	upload.single('file'),
	PodCast.updatePodcastImg
);
//FIM PODCASTER

//ADM
routes.post('/adm/categoria', authMiddlewareAdm, Categoria.store);
routes.put(
	'/adm/categoria/:ctg_id',
	authMiddlewareAdm,
	Categoria.updateCtgDescricao
);
routes.post(
	'/adm/podcast',
	authMiddlewareAdm,
	upload.single('file'),
	PodcastProcedure.store
);
routes.put('/adm/podcast/:pod_id', authMiddlewareAdm, PodcastProcedure.update);
routes.put(
	'/adm/podcastimg/:pod_id',
	authMiddlewareAdm,
	upload.single('file'),
	PodCast.updatePodcastImg
);
routes.put('/adm/podcast/:pod_id/:pod_status', PodCast.updatePodcastStatus);
routes.get(
	'/adm/podcasts/solicitacao',
	authMiddlewareAdm,
	SolicitacaoCadastro.index
);
routes.put(
	'/adm/podcasts/solicitacao/:pod_id/:pod_permissao',
	authMiddlewareAdm,
	SolicitacaoCadastro.update
);
routes.post('/adm/tag', authMiddlewareAdm, Tag.store);
routes.put('/adm/tag/:tag_id', authMiddlewareAdm, Tag.updateTag);
routes.put(
	'/adm/tag/:tag_id/:tag_status',
	authMiddlewareAdm,
	Tag.updateTagStatus
);
routes.put(
	'/adm/users/:usu_id/:usu_status',
	authMiddlewareAdm,
	UserController.updateUserStatus
);
routes.put(
	'/adm/users/tipo/:usu_id/:tus_id',
	authMiddlewareAdm,
	UserController.updateUsuarioTipo
);
routes.get('/adm/users', authMiddlewareAdm, UserController.index);
routes.get('/adm/users/:usu_id', authMiddlewareAdm, UserController.read);
//FIM ADM

//MOD
routes.post('/mod/categoria', authMiddlewareMod, Categoria.store);
routes.put(
	'/mod/categoria/:ctg_id',
	authMiddlewareMod,
	Categoria.updateCtgDescricao
);
routes.put('/mod/podcast/:pod_id', authMiddlewareMod, PodcastProcedure.update);
routes.put(
	'/mod/podcastimg/:pod_id',
	authMiddlewareMod,
	upload.single('file'),
	PodCast.updatePodcastImg
);
routes.put(
	'/mod/podcast/:pod_id/:pod_status',
	authMiddlewareMod,
	PodCast.updatePodcastStatus
);
routes.get(
	'/mod/podcasts/solicitacao',
	authMiddlewareMod,
	SolicitacaoCadastro.index
);
routes.put(
	'/mod/podcasts/solicitacao/:pod_id/:pod_permissao',
	authMiddlewareMod,
	SolicitacaoCadastro.update
);
routes.put(
	'/mod/users/:usu_id/:usu_status',
	authMiddlewareMod,
	UserController.updateUserStatus
);
routes.put(
	'/mod/users/tipo/:usu_id/:tus_id',
	authMiddlewareMod,
	UserController.updateUsuarioTipo
);
routes.get('/mod/users', authMiddlewareMod, UserController.index);
routes.get('/mod/users/:usu_id', authMiddlewareMod, UserController.read);
//FIM MOD

//TESTES
routes.get('/adm/', authMiddlewareAdm, (req, resp) => {
	return resp.json({ msg: 'LOGADO COMO ADM' });
});

routes.get('/getdate', (req, resp) => {
	return resp.json({ data: date(Date.now()).format });
});
//FIM TESTES

module.exports = routes;