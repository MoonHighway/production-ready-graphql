import styled from "styled-components";

export const StatusIndicator = ({
  status = "CLOSED",
  onChange = (f) => f,
}) => (
  <>
    <Circle
      color="green"
      selected={status === "OPEN"}
      onClick={() => onChange("OPEN")}
    />
    <Circle
      color="yellow"
      selected={status === "HOLD"}
      onClick={() => onChange("HOLD")}
    />
    <Circle
      color="red"
      selected={status === "CLOSED"}
      onClick={() => onChange("CLOSED")}
    />
  </>
);

const Circle = styled.div`
  border-radius: 50%;
  background-color: ${({ color, selected }) =>
    selected ? color : "transparent"};
  border: solid 2px ${({ color }) => color};
  border-width: ${({ selected }) => (selected ? "0" : "2")};
  width: 20px;
  height: 20px;
  cursor: pointer;
  float: left;
  margin: 0 4px;
`;
