import styled from "styled-components";
import PricingPlanCard from "@/components/PricingPlanCard/PricingPlanCard";
import { useState } from "react";
import { Trash2, X } from "lucide-react";
import {CloseButton, DeleteAccountButton} from "@/styles/ButtonStyles";


const ProfileWrapper = styled.div`
  padding: 24px;
  /* background: #000; */
  /* width: 68%; */
  /* position: fixed; */
  border: 0.2rem solid black;
  border-radius: 2rem;
`;

const ProfileTitle = styled.h2`
  margin: 0 0 2rem;
  font-size: 1.2rem;
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
  color: #000000;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 4px;
  margin: 4rem auto 7rem;
`;


const SubmitButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.8rem 1rem 0.9rem;
  border: none;
  height: 3rem;
  border-radius: 1rem;
  background: #ffffff;
  color: #060606;
  cursor: pointer;
`;

export default function Profile({
  user,
  userLoading,
  userError,
  onCancel,
  onDelete,
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
       <CloseButton
              type="button"
              onClick={onCancel}
              aria-label="Close"
            >
              <X size={20} />
         </CloseButton>
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
        <PricingPlanCard variant="current" />
      </ProfileItem>

        <ProfileItem>
          <Label>Registered</Label>

          <Value>
            {new Date(user.createdAt).toLocaleDateString("de-DE")}
          </Value>
        </ProfileItem>

        <ButtonWrapper>
          <SubmitButton type="button">
            Save Changes
          </SubmitButton>

         <DeleteAccountButton
             type="button"
             onClick={() => setShowDeleteProfilePopup(true)}
             aria-label="Delete bank account"
             title="Delete bank account"
           >
             <Trash2 size={18} />
       
             <span>
               Delete Account Profile Data
             </span>
           </DeleteAccountButton>
      </ButtonWrapper>
      </ProfileSection>
    </ProfileWrapper>
  );
}