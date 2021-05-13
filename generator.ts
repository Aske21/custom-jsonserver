const fs = require("fs");
const axios = require("axios");

var profileAPILink = "https://randomuser.me/api/?results=10&password=lower, 5-10&inc=name,email,login";
var postsAndCommentsAPILink =
  "https://api.stackexchange.com/2.2/questions?order=desc&min=20&max=25&sort=votes&site=stackoverflow&filter=!9McUSqKnjnKWxX9(Das65CP2TajKKy10x)if0.4rTbjTcfjFseQc_bL";

//#region Interface

interface APIName {
  title: string;
  first: string;
  last: string;
}

interface APILogin {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

interface APIProfile {
  name: APIName;
  email: string;
  login: APILogin;
}

interface APIProfileResponse {
  results: APIProfile[];
}

interface APIAnswer {
  down_vote_count: Number;
  up_vote_count: Number;
  answer_id: Number;
  question_id: Number;
  body: String;
}

interface APIQuestion {
  answers: APIAnswer[];
  down_vote_count: Number;
  up_vote_count: Number;
  question_id: Number;
  title: String;
  body: String;
}

interface APIQuestionResponse {
  items: APIQuestion[];
}

//#endregion

//#region Class

class Profile {
  id: Number;
  name: String;
  surname: String;
  username: String;
  email: String;
  password: String;

  constructor(id: Number, name: String, surname: String, username: String, email: String, password: String) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

class Post {
  id: Number;
  title: String;
  author: Number;
  body: String;
  upVoteCount: Number;
  downVoteCount: Number;

  constructor(
    id: Number,
    title: String,
    author: Number,
    body: String,
    upVoteCount: Number,
    downVoteCount: Number
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.body = body;
    this.upVoteCount = upVoteCount;
    this.downVoteCount = downVoteCount;
  }
}

class PostComment {
  id: Number;
  postId: Number;
  body: String;
  upVoteCount: Number;
  downVoteCount: Number;

  constructor(id: Number, postId: Number, body: String, upVoteCount: Number, downVoteCount: Number) {
    this.id = id;
    this.postId = postId;
    this.body = body;
    this.upVoteCount = upVoteCount;
    this.downVoteCount = downVoteCount;
  }
}

class Output {
  profiles: Profile[];
  posts: Post[];
  comments: PostComment[];

  constructor(profiles: Profile[], posts: Post[], comments: PostComment[]) {
    this.profiles = profiles;
    this.posts = posts;
    this.comments = comments;
  }

  get() {
    return {
      profiles: this.profiles,
      posts: this.posts,
      comments: this.comments,
    };
  }

  ToJSON() {
    return JSON.stringify({
      profiles: this.profiles,
      posts: this.posts,
      comments: this.comments,
    });
  }
}

//#endregion

//#region API Functions

async function GetProfiles(): Promise<Profile[]> {
  let profiles: Profile[] = [];

  await axios.get(profileAPILink).then((res) => {
    let data: APIProfileResponse = res.data;

    data.results.forEach((profile: APIProfile, index: number) => {
      profiles.push(
        new Profile(
          index,
          profile.name.first,
          profile.name.last,
          profile.login.username,
          profile.email,
          profile.login.password
        )
      );
    });
  });

  return profiles;
}

async function GetPostsWithComments(maxUsers: number): Promise<[Post[], PostComment[]]> {
  let posts: Post[] = [];
  let comments: PostComment[] = [];

  await axios.get(postsAndCommentsAPILink).then((res) => {
    console.log("\nAPI podaci učitani...");

    let data: APIQuestionResponse = res.data;
    let validPostCount = 1;

    data.items.every((question: APIQuestion, i: number) => {
      if (question.answers.length != 0) {
        posts.push(
          new Post(
            question.question_id,
            question.title,
            Math.round(Math.random() * maxUsers),
            question.body,
            question.up_vote_count,
            question.down_vote_count
          )
        );

        console.log(`\nPost ${validPostCount} učitan..`);
        console.log("\nUčitavam komentare...");

        let maxComments = Math.round(Math.random() * 20);
        let commentsCount = 0;

        question.answers.every((comment: APIAnswer, j: number) => {
          comments.push(
            new PostComment(
              comment.answer_id,
              comment.question_id,
              comment.body,
              comment.up_vote_count,
              comment.down_vote_count
            )
          );

          console.log(`Učitan komentar ${j + 1} posta ${validPostCount}`);

          if (j + 1 == maxComments) return false;
          ++commentsCount;

          return true;
        });

        console.log(
          `\nUčitani svi komentari za post ${validPostCount}, ukupno ${commentsCount} komentara \n`
        );

        if (validPostCount == 20) return false;
        ++validPostCount;

        return true;
      }
    });

    console.log(`Učitano ukupno ${validPostCount} validnih postova. \n`);
  });

  return [posts, comments];
}

//#endregion

//#region Main

async function main() {
  fs.truncate("./db.json", 0, () => {});

  console.log("DB obrisan \n");

  console.log("Započinjem upis... \n");

  console.log("Učitavam profile...\n");
  let profiles: Profile[] = await GetProfiles();

  console.log("Učitavam postove i komentare...");
  let [posts, comments]: [Post[], PostComment[]] = await GetPostsWithComments(profiles.length);

  console.log("Zapisujem u bazu...\n");

  fs.writeFile("./db.json", new Output(profiles, posts, comments).ToJSON(), (err) => {
    if (err) {
      console.log("Greška pri zapisivanju u bazu");
      console.log(err);
      return;
    }

    console.log("Uspješno zapisano u bazu: db.json");
  });
}

//#endregion

main();
