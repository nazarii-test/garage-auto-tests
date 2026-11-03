import { APIRequestContext, expect } from "@playwright/test";

export default class GarageService {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }
    async getAllBrands() {
        const response = await this.request.get("/api/cars/brands");
        const responseJson = await response.json();
        expect(response.status()).toBe(200);

        return responseJson.data;
    }

    async getAllModels() {
        const response = await this.request.get("/api/cars/models");
        const responseJson = await response.json();
        expect(response.status()).toBe(200);

        return responseJson.data;
    }


    async getModel(id: number, isPositive: boolean = true) {
        const response = await this.request.get(`/api/cars/models/${id}`);
        if (isPositive) {
            const responseJson = await response.json();
            expect(response.status()).toBe(200);

            return responseJson.data;
        } else {
            return response;
        }
    }

    async removeCar(sid: string, id: number, isPositive: boolean = true) {
        const response = await this.request.delete(`/api/cars/${id}`, {
            headers: {
                cookie: sid,
            },
        });

        if (isPositive) {
            const responseJson = await response.json();
            expect(response.status()).toBe(200);

            return responseJson.data;
        } else {
            return response;
        }
    }

    async addCar(sid: string, carBrandId: number, carModelId: number, mileage: number, isPositive: boolean = true) {
        const response = await this.request.post("/api/cars", {
            data: {
                carBrandId,
                carModelId,
                mileage,
            },
            headers: {
                'cookie': sid
            }
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(201);

        const addedCar = responseJson.data;
        return addedCar;
    }
}