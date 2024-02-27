import * as Realm from "realm-web";

export class mongoAppApi {
  static app = new Realm.App(process.env.REALM_APP_ID ?? "application-0-rqzsr");

  public static async getAllIssues() {
    const credentials = Realm.Credentials.anonymous();
    try { 
      const user = await mongoAppApi.app.logIn(credentials);
      console.log("getAllIssues User Logged in ", user.id);
      const epd = await user.functions.getAllIssues();
      return epd;
    } catch (error) {
      console.log(error);
    }
  }

  public static async insertIssue( latitude: Number, longitude: Number) {
    try { 
      const email = "afreledonu@gmail.com";
      const password = "123321123asd";
      
      const credentials = Realm.Credentials.emailPassword(email, password);
      const user = await mongoAppApi.app.logIn(credentials);
      console.log("getAllIssues User Logged in ", user.id);
      const epd = await user.functions.insertIssue(latitude, longitude);
      return epd;
    } catch (error) {
      throw error
    }
  }
}