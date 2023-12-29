import classes from "./styles.module.scss";

const LoadingSpinner = () => {
  return (
    <span role="status" className={classes.wrapper}>
      <span className={classes["sr-only"]}>loading...</span>
    </span>
  );
};

export default LoadingSpinner;
