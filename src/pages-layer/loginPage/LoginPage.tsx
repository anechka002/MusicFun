import {type SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNavigate} from "react-router";
import {
  useLoginMutation
} from "@/features-layer/auth-slice/model/useLoginMutation.ts";

const schema = z.object({
  login: z.string({message: 'Login is required'}).min(3),
  password: z.string().min(3, 'Min 3'),
})
type LoginFormInputs = z.infer<typeof schema>


export const LoginPage = () => {

  const {mutateAsync} = useLoginMutation()

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: {errors}
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(schema)
  })

  const myHandleSubmit: SubmitHandler<LoginFormInputs> = async (inputs) => {
    try {
      const data = await mutateAsync(inputs)
      navigate('/profile/' + data!.userId)
    } catch {
      setError('login', {
        message: 'Incorrect login or password'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(myHandleSubmit)}>
      <hr />
      <div>
        <input
          {...register('login', {required: true})}
        />
        {errors.login && <span>{errors.login.message}</span>}
      </div>
      <div>
        <input type={'password'} {...register('password', {required: true})} />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      <button type={'submit'}>Login</button>
    </form>
  );
};