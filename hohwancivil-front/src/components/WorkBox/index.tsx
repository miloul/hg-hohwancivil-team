import { Button, Stack, Text, Th, useMediaQuery } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export interface WorkBoxProps {
  id: string;
  isFinish: boolean;
  location: string;
  title: string;
  startDate: string;
  endDate: string;
  agritype: string;
  wage?: string;
}

const WorkBox = ({
  id,
  isFinish,
  location,
  title,
  startDate,
  endDate,
  agritype,
  wage = "",
}: WorkBoxProps) => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  return (
    <Link to={`/work/${id}`}>
      <Th>{location}</Th>
      <Th>
        <Stack>
          <Text
            fontWeight={isLargerThan768 ? "bold" : "normal"}
            fontSize={isLargerThan768 ? "1.3rem" : "1rem"}
          >
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
    </Link>
  );
};

export default WorkBox;
