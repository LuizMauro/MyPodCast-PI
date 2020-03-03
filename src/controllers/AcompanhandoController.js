const Acompanhando = require('../models/Feedback');

module.exports = {
	//SELECT
	async index(req, resp) {
		const fav = await Acompanhando.findAllFeedback();

		return resp.json(fav);
	},

	async read(req, resp) {
		const { userId } = req;
		const fav = await Acompanhando.findFeedbackUser(userId);

		return resp.json(fav);
	},

	//CREATE
	async store(req, resp) {
		const { pod_id } = req.params;
		const { userId } = req;

		//regras de negocio

		//final regras de negocio

		const data = ['2019-11-24 21:36:48', 1, 0, 0, userId, pod_id, 3];
		const marcar = await Acompanhando.createFeedback(data);

		if (!marcar) {
			return resp.json({
				mensagem: 'Não foi possível marcar Podcast!',
				_id: marcar
			});
		}
		return resp.json({ mensagem: 'Podcast marcado como Acompanhando!', _id: marcar });
	},

	//UPDATE - Muda de Acompanhando para Pretendo Acompanhar ou cancela (pelo valor do fbk_status).
	async update(req, res) {
        const { pod_id, fbk_status } = req.params;
        const { userId } = req;

		const alterar = await Acompanhando.findAcompanhando(pod_id);

		if (alterar) {
			const { fbk_id } = alterar;

			const update = await Acompanhando.updateFeedback(fbk_id, fbk_status, userId);
			console.log(fbk_id, fbk_status);

			if (!update) {
				return res.json({
					mensagem: 'Não foi possível desmarcar podcast!',
					_id: update
				});
			}
			return res.json({
				mensagem: 'Voce mudou a marcação do podcast!',
				_id: update
			});
		}
	}
};
