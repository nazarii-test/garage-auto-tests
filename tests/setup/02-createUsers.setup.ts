import { test as setup } from "@playwright/test";
import UsersService from "../../utils/api/services/UsersService";
import AuthService from "../../utils/api/services/AuthService";
import { testUser1, testUser2 } from "../../test-data/validUsers";

let usersService: UsersService;
let authService: AuthService;

setup.describe('Create test users via API', () => {

    setup.beforeEach(({ request }) => {
        usersService = new UsersService(request);
        authService = new AuthService(request);
    })

    setup('Create user testuser1', async () => {
        await usersService.createUser(testUser1.name, testUser1.lastName, testUser1.email, testUser1.password, testUser1.password);
    })

    setup('Create user testuser2', async () => {
        await usersService.createUser(testUser2.name, testUser2.lastName, testUser2.email, testUser2.password, testUser2.password);
    })
})