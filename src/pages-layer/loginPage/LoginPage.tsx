import {type SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMeQuery} from "@/features-layer/auth-slice/model/useMeQuery.ts";
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

  const {data} = useMeQuery()

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

    // mutate(inputs, {
    //   onSuccess: (data) => {
    //     navigate('/profile/' + data!.userId)
    //   },
    //   onError: () => {
    //     setError('login', {
    //       message: 'Incorrect login or password'
    //     })
    //   }
    // })
  }

  if (data) return <div>вы залогинены</div>

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