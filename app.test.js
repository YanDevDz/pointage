const request = require("supertest");
const app = require("./app");

describe("Pointage API", () => {
	it("GET /employees", () => {
		return request(app)
			.get("/api/employees")
			.expect("Content-Type", /json/)
			.expect(200)
			.then((response) => {
				expect(response.body).toEqual(
					expect.objectContaining({
						success: expect.any(Boolean),
						employees: expect.arrayContaining([
							// expect.objectContaining({
							// 	id: expect.any(String),
							// 	name: expect.any(String),
							// 	firstName: expect.any(String),
							// 	department: expect.any(String),
							// 	dateCreated: expect.any(String),
							// }),
						]),
					})
				);
			});
	});
	it("GET /employees?date", () => {
		return request(app)
			.get("/api/employees?date=2021-10-05")
			.expect("Content-Type", /json/)
			.expect(200)
			.then((response) => {
				console.log(response.body);
				expect(response.body).toStrictEqual(
					expect.objectContaining({
						success: expect.any(Boolean),
						employees: expect.arrayContaining([
							// expect.objectContaining({
							//     id: expect.any(String),
							//     name: expect.any(String),
							//     firstName: expect.any(String),
							//     department: expect.any(String),
							//     dateCreated: expect.any(String),
							// }),
						]),
					})
				);
			});
	});
	it("POST /addEmployee", () => {
		return request(app)
			.post("/api/addEmployee")
			.send({
				name: "benslimane",
				firstName: "yanis",
				department: "info",
			})
			.expect("Content-type", /json/)
			.expect(200)
			.then((response) => {
				expect(response.body).toEqual(
					expect.objectContaining({
						success: expect.any(Boolean),
						msg: expect.any(String),
					})
				);
			});
	});
	it("POST /check-in", () => {
		return request(app)
			.post("/api/check-in")
			.send({
				employeeId: "ku9trsir",
				comment: "just a comment",
			})
			.expect("Content-type", /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(expect.objectContaining({
                    success: expect.any(Boolean),
                    msg : expect.any(String)
                }));
            })
	});
	it("POST /check-out", () => {
        return request(app)
			.post("/api/check-out")
			.send({
				employeeId: "ku9trsir",
				comment: "just a comment !",
			})
			.expect("Content-type", /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(expect.objectContaining({
                    success: expect.any(Boolean),
                    msg : expect.any(String)
                }));
            })
    });
});
