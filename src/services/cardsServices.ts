import * as companyRepository from "../repositories/companyRepository.js"
import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"
import * as rechargeRepository from "../repositories/rechargeRepository.js"

import { faker } from "@faker-js/faker"
import { default as dayjs } from "dayjs"
import * as bcrypt from "bcrypt"

export async function createCard(headers: string, employeeId: number, cardType: cardRepository.TransactionTypes) {
    const apiKey = await companyRepository.findByApiKey(headers)
    if (!apiKey) {
        throw {
            type: "Bad_Request",
            message: "missing API Key at Headers Config"
        }

    };

    const verifyIdEmployee = await employeeRepository.findById(employeeId)
    if (!verifyIdEmployee) {
        throw {
            type: "Not_Found"
        }
    };

    const verifyCardUser = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId)
    if (verifyCardUser) {
        throw {
            type: "Conflict"
        }
    };

    const employee = verifyIdEmployee

    const cardData = await createCardInfos(employee.id, employee.fullName, cardType)

    cardData.securityCode = await createHashCode(cardData.securityCode)

    await cardRepository.insert(cardData);

}

export async function rechargeCard(apiKey: string, cardId: number, value: number) {

    const findApiKey = await companyRepository.findByApiKey(apiKey)
    if (!findApiKey) {
        throw {
            type: "Bad_Request",
            message: "missing API Key at Headers Config"
        }

    };

    const card = await findCardById(cardId)
    if (!card) {
        throw {
            type: "Not_Found"
        }

    };

    const checkExpired = isExpired(card.expirationDate)
    if (checkExpired === true) {
        throw {
            type: "Unauthorized",
            message: "Card Has Expired"
        }

    };

    if (value <= 0) {
        throw {
            type: "Unauthorized",
            message: "Value negative"
        }

    };

    const rechargeData = { cardId, amount: value }

    await rechargeRepository.insert(rechargeData)


}

export async function findCardById(cardId: number) {
    const card = await cardRepository.findById(cardId)
    if (!card) return null

    return card
}

export async function createCardInfos(employeeId: number, employeeFullName: string, cardType: cardRepository.TransactionTypes) {

    const cardholderName = generateHolderName(employeeFullName);
    const number: string = faker.finance.creditCardNumber("MasterCard")
    const securityCode: string = faker.finance.creditCardCVV()
    const expirationDate: string = generateDateExpiration()
    const type = cardType
    const isBlocked: boolean = false

    return {
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked,
        type
    }

}
function generateHolderName(fullName: string) {
    const fullNameArray = fullName.split(" ")

    const firstName = fullNameArray.shift()

    const lastName = fullNameArray.pop()

    const middleName = fullNameArray.filter(el => el.length >= 3).map(el => el.slice(0, 1))

    const cardHolderName = [firstName, ...middleName, lastName].join(" ").toUpperCase()

    return cardHolderName
}
function generateDateExpiration() {
    return dayjs(Date.now()).add(5, "year").format('MM/YYYY')
}

async function createHashCode(sensibleData: string) {
    const hash = bcrypt.hashSync(sensibleData, 10)

    return hash

}

export async function activateCard(idCard: number, CVC: string, password: string) {

    const findCard = await cardRepository.findById(idCard);
    console.log(findCard)
    if (!findCard) {
        throw {
            type: "Bad_Request"
        }
    }

    const checkExpired = isExpired(findCard.expirationDate)
    if (checkExpired === true) {
        throw {
            type: "Bad_Request",
            message: "card has expirated"
        }
    }

    if (findCard.password) {
        throw {
            type: "Conflict",
            message: "Card is Already Activated"
        }
    }

    const checkCVC = compareHashData(CVC, findCard.securityCode)
    if (!checkCVC) {
        throw {
            type: "Unauthorized"
        }
    }


    const checkPasswordNumbers = isNaN(parseInt(password)) && password.length != 4
    if (!checkPasswordNumbers) {
        throw {
            type: "Unauthorized"
        }
    }

    findCard.password = await createHashCode(password)

    await cardRepository.update(idCard, findCard)


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

export async function getHistoric(idCard: number) {
    const transaction = await paymentRepository.findByCardId(idCard);
    const recharges = await rechargeRepository.findByCardId(idCard)


    const totalTransactions = sumValues(transaction, "amount")
    const totalRecharge = sumValues(recharges, "amount")

    const balance: number = totalRecharge - totalTransactions;
    return {
        balance,
        transaction,
        recharges
    }
}
function sumValues(array: any[], key: string): number {

    const keyValues: any[] = array.map(el => el[key])

    return keyValues.reduce((current: number, sum: number) => sum + current, 0);

}








