const ip = "7771-39-119-111-95.ngrok-free.app";

export const getChat = async () => {
  console.log("Fetch chats from database...");
  const response = fetch(`https://${ip}:8000/api/chats`, {
    method: "GET",
  });
  return (await response).json();
};

export const sendMessage = async (request: { content: string }) => {
  console.log("Send message...");
  const response = await fetch(`https://${ip}:8000/api/chats/human`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: request.content,
    }),
  });
  return response.text();
};

interface NavigateResponse {
  type: string;
  screenDescription: string;
}

export const navigate = async (request: { url: string }) => {
  console.log("Navigate...");
  const response = await fetch(`https://${ip}:8000/api/chats/navigate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: request.url,
    }),
  });

  const result: NavigateResponse = await response.json();
  return result;
};

export type ActionType =
  | "select"
  | "input"
  | "click"
  | "focus"
  | "item"
  | "pass";

export type ActionComponent = {
  i: string;
  actionType: ActionType;
  description: string;
  html: string;
  question?: string;
  content: string;
};

export type SelectableComponent = {
  i: string;
  description: string;
  actionType?: ActionType;
  data: string | Record<string, string | string[]>;
  content: string;
};

export type AnswerResponse = {
  type: string;
  component?: ActionComponent;
  components?: SelectableComponent[];
  actionValue?: string;
  screenDescription?: string;
};

export const firstOrder = async (request: { content: string }) => {
  console.log("First order...");
  const response = await fetch(`https://${ip}:8000/api/chats/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: request.content,
    }),
  });

  const result: AnswerResponse = await response.json();
  return result;
};

export const answerForInput = async (request: {
  content: string;
  component: ActionComponent;
}) => {
  console.log("Answer for input...");
  const response = await fetch(`https://${ip}:8000/api/chats/answer/input`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: request.content,
      component: request.component,
    }),
  });

  const result: AnswerResponse = await response.json();
  return result;
};

export const answerForSelect = async (request: {
  content: string;
  option: SelectableComponent | null;
  component: ActionComponent | null;
}) => {
  console.log("Answer for select...");
  const response = await fetch(`https://${ip}:8000/api/chats/answer/select`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: request.content,
      option: request.option,
      component: request.component,
    }),
  });

  const result: AnswerResponse = await response.json();
  return result;
};

export const answerForFilter = async (request: {
  content: string;
  component: ActionComponent;
  components: SelectableComponent[];
}) => {
  console.log("Answer for filter...");
  const response = await fetch(`https://${ip}:8000/api/chats/answer/filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: request.content,
      components: request.components,
      component: request.component,
    }),
  });

  const result: AnswerResponse = await response.json();
  return result;
};

export const confirmAnswer = async (request: {
  content: string;
  component: ActionComponent;
  actionValue?: string;
}) => {
  console.log("Confirm...");
  const response = await fetch(`https://${ip}:8000/api/chats/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: request.content,
      component: request.component,
      actionValue: request.actionValue,
    }),
  });

  const result: AnswerResponse = await response.json();
  return result;
};

export const removeChat = async () => {
  console.log("Remove the chat...");
  const response = await fetch(`https://${ip}:8000/api/chats`, {
    method: "DELETE",
  });
  return response.json();
};
