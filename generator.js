var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require("fs");
var axios = require("axios");
var profileAPILink = "https://randomuser.me/api/?results=10&password=lower, 5-10&inc=name,email,login";
var postsAndCommentsAPILink = "https://api.stackexchange.com/2.2/questions?order=desc&min=20&max=25&sort=votes&site=stackoverflow&filter=!9McUSqKnjnKWxX9(Das65CP2TajKKy10x)if0.4rTbjTcfjFseQc_bL";
//#endregion
//#region Class
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
    function Post(id, title, author, body, upVoteCount, downVoteCount) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.body = body;
        this.upVoteCount = upVoteCount;
        this.downVoteCount = downVoteCount;
    }
    return Post;
}());
var PostComment = /** @class */ (function () {
    function PostComment(id, postId, body, upVoteCount, downVoteCount) {
        this.id = id;
        this.postId = postId;
        this.body = body;
        this.upVoteCount = upVoteCount;
        this.downVoteCount = downVoteCount;
    }
    return PostComment;
}());
var Output = /** @class */ (function () {
    function Output(profiles, posts, comments) {
        this.profiles = profiles;
        this.posts = posts;
        this.comments = comments;
    }
    Output.prototype.get = function () {
        return {
            profiles: this.profiles,
            posts: this.posts,
            comments: this.comments
        };
    };
    Output.prototype.ToJSON = function () {
        return JSON.stringify({
            profiles: this.profiles,
            posts: this.posts,
            comments: this.comments
        });
    };
    return Output;
}());
//#endregion
//#region API Functions
function GetProfiles() {
    return __awaiter(this, void 0, void 0, function () {
        var profiles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profiles = [];
                    return [4 /*yield*/, axios.get(profileAPILink).then(function (res) {
                            var data = res.data;
                            data.results.forEach(function (profile, index) {
                                profiles.push(new Profile(index, profile.name.first, profile.name.last, profile.login.username, profile.email, profile.login.password));
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, profiles];
            }
        });
    });
}
function GetPostsWithComments(maxUsers) {
    return __awaiter(this, void 0, void 0, function () {
        var posts, comments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    posts = [];
                    comments = [];
                    return [4 /*yield*/, axios.get(postsAndCommentsAPILink).then(function (res) {
                            console.log("\nAPI podaci učitani...");
                            var data = res.data;
                            var validPostCount = 1;
                            data.items.every(function (question, i) {
                                if (question.answers.length != 0) {
                                    posts.push(new Post(question.question_id, question.title, Math.round(Math.random() * maxUsers), question.body, question.up_vote_count, question.down_vote_count));
                                    console.log("\nPost " + validPostCount + " u\u010Ditan..");
                                    console.log("\nUčitavam komentare...");
                                    var maxComments_1 = Math.round(Math.random() * 20);
                                    var commentsCount_1 = 0;
                                    question.answers.every(function (comment, j) {
                                        comments.push(new PostComment(comment.answer_id, comment.question_id, comment.body, comment.up_vote_count, comment.down_vote_count));
                                        console.log("U\u010Ditan komentar " + (j + 1) + " posta " + validPostCount);
                                        ++commentsCount_1;
                                        if (j + 1 == maxComments_1)
                                            return false;
                                        return true;
                                    });
                                    console.log("\nU\u010Ditani svi komentari za post " + validPostCount + ", ukupno " + commentsCount_1 + " komentara \n");
                                    ++validPostCount;
                                    if (validPostCount == 20)
                                        return false;
                                    return true;
                                }
                            });
                            console.log("U\u010Ditano ukupno " + validPostCount + " validnih postova. \n");
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, [posts, comments]];
            }
        });
    });
}
//#endregion
//#region Main
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var profiles, _a, posts, comments;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fs.truncate("./db.json", 0, function () { });
                    console.log("DB obrisan \n");
                    console.log("Započinjem upis... \n");
                    console.log("Učitavam profile...\n");
                    return [4 /*yield*/, GetProfiles()];
                case 1:
                    profiles = _b.sent();
                    console.log("Učitavam postove i komentare...");
                    return [4 /*yield*/, GetPostsWithComments(profiles.length)];
                case 2:
                    _a = _b.sent(), posts = _a[0], comments = _a[1];
                    console.log("Zapisujem u bazu...\n");
                    fs.writeFile("./db.json", new Output(profiles, posts, comments).ToJSON(), function (err) {
                        if (err) {
                            console.log("Greška pri zapisivanju u bazu");
                            console.log(err);
                            return;
                        }
                        console.log("Uspješno zapisano u bazu: db.json");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
//#endregion
main();
