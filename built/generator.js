var fs = require("fs");
var Profile = /** @class */ (function () {
    function Profile(id, name, surname, username, email, password) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.email = email;
        this.password = password;
    }
    return Profile;
}());
var Post = /** @class */ (function () {
    function Post() {
    }
    return Post;
}());
var Output = /** @class */ (function () {
    function Output() {
    }
    return Output;
}());
var profiles = [
    new Profile("almir", "mulalic", "amulalic", "am@gmail.com", "test"),
    new Profile("almir", "mulalic", "amulalic", "am@gmail.com", "test"),
];
var jsonProfiles = JSON.stringify(profiles);
fs.writeFile("./db.json", jsonProfiles, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Profili importani...");
});
//# sourceMappingURL=generator.js.map