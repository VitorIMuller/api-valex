import * as paymentRepository from "../repositories/paymentRepository.js"
import * as cardsRepositories from "../repositories/cardRepository.js"
import * as businessRepository from "../repositories/businessRepository.js"
import { default as dayjs } from "dayjs"
import * as bcrypt from "bcrypt"
import { getHistoric } from "./cardsServices.js"


export async function posPayment(cardId: number, password: string, businessId: number, amount: number) {
    if (amount <= 0) return null

    const findCard = await cardsRepositories.findById(cardId)
    if (!findCard) return null

    const verifyExpiration = isExpired(findCard.expirationDate)
    if (verifyExpiration === false) return null

    const verifyPassword = compareHashData(password, findCard.password)
    if (verifyPassword === false) return null

    const verifyBusiness = await businessRepository.findById(businessId)
    if (!verifyBusiness) return null

    if (findCard.type !== verifyBusiness.type) return null

    const amountCard = await getHistoric(cardId)
    if (amount > amountCard.balance) return null

    await paymentRepository.insert({ cardId: findCard.id, businessId, amount })


}

function isExpired(date: string): boolean {
    const dateFormat = date.split("/")

    const isExpired = dayjs(`${dateFormat[0]}/31/${dateFormat[1]}`).isBefore(dayjs(Date.now()))

    return isExpired
}

function compareHashData(sensibleData: string, hash: string): boolean {

    const result = bcrypt.compareSync(sensibleData, hash)

    return result
}

