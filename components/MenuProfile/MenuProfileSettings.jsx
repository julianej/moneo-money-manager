import styled from "styled-components";
import { useState } from "react";

const ProfileWrapper = styled.div`
  padding: 24px;
  /* background: #000; */
  color: #878787;
  width: 50%;
  position: fixed;
`;

const ProfileTitle = styled.h1`
  margin-bottom: 32px;
`;

const ProfileSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
`;

const ProfileItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #878787;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #444;
  border-radius: 6px;
  background: #111;
  color: white;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: white;
  }
`;

const Value = styled.span`
  font-size: 18px;
  color: white;
`;

const SaveButton = styled.button`
  margin-top: 10px;
  padding: 12px 20px;
  border: none;
  border-radius: 999px;
  background: white;
  color: black;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  margin-top: 24px;
  padding: 12px 20px;
  border: none;
  border-radius: 999px;
  background: #333;
  color: #fff;
  cursor: pointer;
`;

export default function Profile({
  user,
  userLoading,
  userError,
  onClose,
}) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  if (userLoading) {
    return <p>Loading user...</p>;
  }

  if (userError) {
    return <p>Could not load profile.</p>;
  }

  return (
    <ProfileWrapper>
      <ProfileTitle>Profile Settings</ProfileTitle>

      <ProfileSection>

        <ProfileItem>
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </ProfileItem>

        <ProfileItem>
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </ProfileItem>

        <ProfileItem>
          <Label>Plan</Label>
          <Value>{user.plan}</Value>
        </ProfileItem>

        <ProfileItem>
          <Label>Registered</Label>

          <Value>
            {new Date(user.createdAt).toLocaleDateString("de-DE")}
          </Value>
        </ProfileItem>

        <SaveButton type="button">
          Save Changes
        </SaveButton>

        <DeleteButton type="button">
          Delete Account
        </DeleteButton>

      </ProfileSection>
    </ProfileWrapper>
  );
}