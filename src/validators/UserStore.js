const Yup = require("yup");

module.exports.validation = async function(req, res, next) {
  try {
    const schema = Yup.object().shape({
      nome: Yup.string()
        .required("Campo obrigatório!")
        .min(3)
        .max(45)
        .trim(),
      senha: Yup.string()
        .required("Campo obrigatório!")
        .trim()
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&!@#%])[0-9a-zA-Z$*&!@#%]{6,45}$/
        ),
      //senha: Yup.string().required('Campo obrigatório!').min(6).max(45).trim(),
      email: Yup.string()
        .email("Campo obrigatório!")
        .required("O email é obrigario")
        .max(45)
        .trim(),
      cpf: Yup.string()
        .required("Campo obrigatório!")
        .trim()
        .matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
    });
    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: "Validation fails", messages: err.inner });
  }
};
