import { SecretDataType } from "../../secretDataType";

export default function Home(props: { showSecretData: Array<SecretDataType> }) {
  return (
    <div>
      {props.showSecretData.map((secretArray: SecretDataType, key: number) => {
        return (
          <div
            key={key}
            style={{
              width: "100%",
              marginLeft: "3%",
            }}>
            <span>
              <b>{key + 1} : </b>
            </span>
            <span style={{ marginRight: "20px" }}>
              <b>Title : </b>
              {secretArray.title}
            </span>
            <span>
              <b>Login Info : </b>
              {secretArray.user.login}
            </span>
          </div>
        );
      })}
    </div>
  );
}
