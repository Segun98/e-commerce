import { useState, useEffect } from "react";
import {
  FormControl,
  Text,
  FormLabel,
  Button,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/core";
import { useUser } from "@/Context/UserProvider";
import axios from "axios";
import { restEndpoint } from "@/utils/client";

export const ContactForm = () => {
  const { User } = useUser();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  //add user name and emial to contact form
  useEffect(() => {
    if (User["first_name"]) {
      setName(User.first_name + " " + User.last_name);
      setEmail(User.email);
    }
  }, [User]);

  //submit contact form
  const handleSubmit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${restEndpoint}/contact`, {
        email,
        subject,
        body: `
        Name: ${name},
  
        ${body}
        `,
      });
      toast({
        title: "Message sent",
        position: "bottom",
        status: "success",
      });

      //cleanups
      setLoading(false);
      setName("");
      setEmail("");
      setBody("");
      setSubject("");
    } catch (err) {
      setLoading(false);
      toast({
        title: "An error occured",
        position: "bottom",
        status: "error",
      });
    }
  };

  return (
    <section className="contact" id="contact">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <Text as="div" className="form-item">
            <FormLabel htmlFor="full name">Full Name</FormLabel>
            <Input
              variant="filled"
              type="text"
              id="full name"
              name="full name"
              placeholder="Your Name"
              errorBorderColor="red.300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Text>
          <Text as="div" className="form-item">
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              variant="filled"
              type="email"
              id="email"
              name="email"
              placeholder="email@example.com"
              errorBorderColor="red.300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Text>
          <Text as="div" className="form-item">
            <FormLabel htmlFor="subject">Subject</FormLabel>
            <Input
              variant="filled"
              type="text"
              id="subject"
              name="subject"
              placeholder="Subject"
              errorBorderColor="red.300"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Text>
          <Text as="div" className="form-item">
            <FormLabel htmlFor="body">Body</FormLabel>
            <Textarea
              variant="filled"
              id="body"
              name="body"
              placeholder="Start typing..."
              errorBorderColor="red.300"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Text>
        </FormControl>
        <Text as="div" className="form-item" textAlign="center">
          <Button
            type="submit"
            isLoading={loading}
            size="md"
            background="var(--deepblue)"
            color="white"
            width="100px"
          >
            Send
          </Button>
        </Text>
      </form>
    </section>
  );
};
