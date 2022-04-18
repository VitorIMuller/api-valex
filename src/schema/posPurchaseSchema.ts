import joi from "joi"

const posPurchaseSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().required(),
    idBusiness: joi.number().required(),
    amounth: joi.number().required()
})


export default posPurchaseSchema