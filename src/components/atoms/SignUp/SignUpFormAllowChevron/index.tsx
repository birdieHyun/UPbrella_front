import ChevronRightIcon from "@mui/icons-material/ChevronRight";
type SignUpFormAllowChevronProps = {
  onClick: () => void;
};

const SignUpFormAllowChevron = ({ onClick }: SignUpFormAllowChevronProps) => {
  return (
    <div onClick={onClick}>
      <ChevronRightIcon />
    </div>
  );
};
export default SignUpFormAllowChevron;
