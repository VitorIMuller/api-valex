import joi from "joi"

const activateCardSchema = joi.object({
    id: joi.number().required(),
    CVC: joi.string().required(),
    password: joi.string().required()
})

export default activateCardSchema