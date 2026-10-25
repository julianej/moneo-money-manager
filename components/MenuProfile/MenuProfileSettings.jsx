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



const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.65);
`;

const PopupContent = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  box-sizing: border-box;
  background: #fff;
  color: #000;
  border: 2px solid #000;
  border-radius: 1.5rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);

  h3 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
  }

  p {
    line-height: 1.6;
  }

  [role="alert"] {
    color: #c62828;
  }
`;

const PopupActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;

  button {
    margin: 0;
  }
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

  const [showDeleteProfilePopup, setShowDeleteProfilePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");


async function handleDeleteAccount() {
  setIsDeleting(true);
  setDeleteError("");

  try {
    const response = await fetch("/api/user/delete", {
      method: "DELETE",
      credentials: "same-origin",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Could not delete your account."
      );
    }

    if (onDelete) {
      onDelete();
    }

    window.location.assign("/");
  } catch (error) {
    console.error("ACCOUNT DELETION ERROR:", error);
    setDeleteError(
      error.message || "Account deletion failed. Please try again."
    );
  } finally {
    setIsDeleting(false);
  }
}



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
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString("de-DE")
            : "—"}
        </Value>
      </ProfileItem>

      <ButtonWrapper>
        <SubmitButton type="button">
          Save Changes
        </SubmitButton>

        <DeleteAccountButton
          type="button"
          onClick={() => {
            setDeleteError("");
            setShowDeleteProfilePopup(true);
          }}
          aria-label="Delete account profile"
          title="Delete account profile"
        >
          <Trash2 size={18} />
          <span>Delete Account Profile Data</span>
        </DeleteAccountButton>
      </ButtonWrapper>
    </ProfileSection>

    {/* DELETE ACCOUNT MODAL */}
    {showDeleteProfilePopup && (
      <PopupOverlay
        onMouseDown={(event) => {
          if (
            event.target === event.currentTarget &&
            !isDeleting
          ) {
            setShowDeleteProfilePopup(false);
            setDeleteError("");
          }
        }}
      >
        <PopupContent
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-profile-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <h3 id="delete-profile-title">
            Delete your MONEO account?
          </h3>

          <p>
            Your profile, transactions, categories, and bank
            account records will be permanently deleted.
          </p>

          <p>
            <strong>This action cannot be undone.</strong>
          </p>

          {deleteError && (
            <p role="alert">{deleteError}</p>
          )}

          <PopupActions>
            <SubmitButton
              type="button"
              onClick={() => {
                setShowDeleteProfilePopup(false);
                setDeleteError("");
              }}
              disabled={isDeleting}
            >
              Cancel
            </SubmitButton>

            <DeleteAccountButton
              type="button"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              <Trash2 size={18} />
              <span>
                {isDeleting
                  ? "Deleting..."
                  : "Delete permanently"}
              </span>
            </DeleteAccountButton>
          </PopupActions>
        </PopupContent>
      </PopupOverlay>
    )}
  </ProfileWrapper>
)}; 