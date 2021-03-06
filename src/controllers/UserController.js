const User = require('../models/User');
const { hash } = require('bcryptjs');

module.exports = {
	//SELECTS
	async index(req, resp) {
		const users = await User.findAll();

		return resp.json(users);
	},

	async indexAllUsers(req, resp) {
		const users = await User.findAllUsers();

		return resp.json(users);
	},

	async indexAllModUser(req, resp) {
		const users = await User.findAllModUser();

		return resp.json(users);
	},

	async read(req, resp) {
		const { userId } = req;
		const user = await User.findOneUser(userId);
		return resp.json(user);
	},

	//CADASTROS
	async store(req, resp) {
		const { nome, senha, email, cpf, tus_id } = req.body;

		if (senha) {
			const criptSenha = await hash(senha, 8);

			const checaNome = await User.verifyNome(nome);
			if (checaNome) {
				console.log('caiu aq');
				return resp.json({
					nomeExists: true,
				});
			}

			const checaEmail = await User.verifyEmail(email);
			if (checaEmail) {
				return resp.json({
					emailExists: true,
				});
			}

			const checaCpf = await User.verifyCpf(cpf);
			if (checaCpf) {
				return resp.json({
					cpfExists: true,
				});
			}

			const data = [nome, criptSenha, email, cpf, 1, 0, tus_id];
			const id = await User.createUser(data);

			if (!id) {
				return resp.json({ mensagem: 'Erro ao criar usuario!', _id: id });
			}
			return resp.json({ mensagem: 'Usuario criado com sucesso!', _id: id });
		} else {
			return resp.json({ mensagem: 'Erro ao criar usuario!', _id: id });
		}
	},

	//UPDATES
	async updateUserStatus(req, res) {
		const { usu_id, usu_status } = req.params;

		const userUpdate = await User.updateUserStatus(usu_id, usu_status);

		if (!userUpdate) {
			return res.json({
				mensagem: 'Erro ao atualizar status',
				_id: userUpdate,
			});
		}
		return res.json({
			mensagem: 'status atualizado com sucesso!',
			_id: userUpdate,
		});
	},

	async updateUserPerfil(req, res) {
		const { userId } = req;
		const { usu_nome, usu_email, usu_senha } = req.body;

		let criptSenha = null;

		if (usu_senha) {
			criptSenha = await hash(usu_senha, 8);
		}
		console.log('senha nova', usu_senha);
		console.log('senha nova criptografa', criptSenha);

		const atual = await User.findUser(userId);
		const verifica = await User.findEditValidation(userId);
		console.log('atual é', atual);
		const { usu_cpf } = atual;

		if (verifica.some((usuario) => usuario.usu_nome === usu_nome)) {
			console.log('nome ja existe');
			return res.json({
				mensagem: 'Nome de usuário já existe',
				usuNomeExists: true,
			});
		} else if (verifica.some((usuario) => usuario.usu_email === usu_email)) {
			return res.json({ mensagem: 'email já existe', usuEmailExists: true });
		}

		const userUpdate = await User.updateUserPerfil(
			userId,
			usu_nome,
			usu_email,
			usu_senha ? criptSenha : atual.usu_senha
		);

		if (!userUpdate) {
			return res.json({
				mensagem: 'não foi possível editar perfil',
			});
		}
		return res.json({
			usu_nome: usu_nome,
			usu_email: usu_email,
			usu_cpf: usu_cpf,
			tus_id: atual.tus_id,
			usu_id: atual.usu_id,
			tus_descricao: atual.tus_descricao,
		});
	},

	async updateUserSenha(req, res) {
		const { usu_senha } = req.body;
		const { userId } = req;

		if (usu_senha) {
			const criptSenha = await hash(usu_senha, 8);

			const userUpdate = await User.updateUserSenha(userId, criptSenha);

			if (!userUpdate) {
				return res.json({ mensagem: 'Erro ao mudar senha!', _id: userUpdate });
			}
			return res.json({
				mensagem: 'senha alterada!',
				_id: userUpdate,
			});
		} else {
			return res.json({ mensagem: 'Erro ao mudar senha!', _id: userUpdate });
		}
	},

	async updateUsuarioTipo(req, res) {
		const { tus_id, usu_id } = req.params;

		const userUpdate = await User.updateUsuarioTipo(tus_id, usu_id);

		if (!userUpdate) {
			return res.json({ mensagem: 'Erro ao mudar status!', _id: userUpdate });
		}
		return res.json({
			mensagem: 'status alterado!',
			_id: userUpdate,
		});
	},
};
