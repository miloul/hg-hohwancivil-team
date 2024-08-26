import { Button, Stack, Text, Th } from "@chakra-ui/react";

export interface WorkBoxProps {
  isFinish: boolean;
  location: string;
  title: string;
  startDate: string;
  endDate: string;
  agritype: string;
  wage?: string;
}

const WorkBox = ({
  isFinish,
  location,
  title,
  startDate,
  endDate,
  agritype,
  wage = "",
}: WorkBoxProps) => {
  return (
    <>
      <Th>{location}</Th>
      <Th>
        <Stack>
          <Text fontWeight="bold" fontSize="1.3rem">
            {title}
          </Text>
          <Text>
            {startDate}~{endDate}
          </Text>
          <Text>{agritype}</Text>
        </Stack>
      </Th>
      {wage === "" ? <Th>x</Th> : <Th>{wage}</Th>}
      <Th>
        {isFinish ? (
          <Button isDisabled={false}>마감</Button>
        ) : (
          <Button>지원하기</Button>
        )}
      </Th>
    </>
  );
};

export default WorkBox;
