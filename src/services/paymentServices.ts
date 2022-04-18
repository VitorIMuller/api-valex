import * as paymentRepository from "../repositories/paymentRepository.js"
import * as cardsRepositories from "../repositories/cardRepository.js"
import * as businessRepository from "../repositories/businessRepository.js"
import { default as dayjs } from "dayjs"
import * as bcrypt from "bcrypt"
import { getHistoric } from "./cardsServices.js"


export async function posPayment(id: number, password: string, businessId: number, amount: number) {
    if (amount <= 0) {
        throw {
            type: "Unauthorized",
            message: "amount negative"
        }
    }

    const findCard = await cardsRepositories.findById(id)
    if (!findCard) {
        throw {
            type: "Unauthorized"
        }
    }
    console.log(findCard)
    const verifyExpiration = isExpired(findCard.expirationDate)
    console.log(verifyExpiration)
    if (verifyExpiration) {
        throw {
            type: "Unauthorized"
        }
    };

    const verifyPassword = compareHashData(password, findCard.password)
    if (verifyPassword === false) {
        throw {
            type: "Unauthorized",
            message: "Incorrect password"
        }
    }

    const verifyBusiness = await businessRepository.findById(businessId)
    if (!verifyBusiness) return null

    if (findCard.type !== verifyBusiness.type) return null

    const amountCard = await getHistoric(id)
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

