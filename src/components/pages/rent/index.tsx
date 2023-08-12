import MobileHeader from "@/components/organisms/MobileHeader";
import FormBasic from "@/components/atoms/Form/FormBasic";
import FormStatus from "@/components/atoms/Form/FormStatus";
import FormButton from "@/components/atoms/Form/FormButton";
import FormLocationMolecules from "@/components/molecules/FormLocationMolecules";

const RentPage = () => {
  return (
    <div className="flex-col max-w-2xl">
      <MobileHeader />
      <div className="mt-20 text-24 font-semibold leading-32 text-black mb-32">
        우산을 빌릴까요?
      </div>
      <FormBasic label="이름" />
      <FormBasic label="전화번호" />
      <FormLocationMolecules label="대여지점" />
      <FormBasic label="우산번호" />
      <FormStatus label="상태신고" placeholder="우산이나 대여 환경에 문제가 있다면 작성해주세요!" />
      <FormButton label="대여하기" />
    </div>
  );
};

export default RentPage;