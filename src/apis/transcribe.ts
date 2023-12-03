const ip = "7771-39-119-111-95.ngrok-free.app";

export const test = {
  send: async () => {
    const response = await fetch(`https://${ip}:8000/test`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Response:", responseData);
    } else {
      console.log("Error:", response.status);
    }
  },
};

export const transcribe = async (request: { formData: FormData }) => {
  const response = fetch(`https://${ip}:8000/api/openai/transcribe`, {
    method: "POST",
    body: request.formData,
  });
  return (await response).text();
};
