import Header from '../../components/Header'
import api from '../../services/api'
import Food from '../../components/Food'
import ModalAddFood from '../../components/ModalAddFood'
import ModalEditFood from '../../components/ModalEditFood'
import { FoodsContainer } from './styles'
import { useEffect, useState } from 'react'

interface FoodProps {
  id: number
  name: string
  description: string
  price: string
  available: boolean
  image: string
}

export function Dashboard(props: FoodProps) {
  const [foods, setFoods] = useState<FoodProps[]>([])
  const [editingFood, setEditingFood] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    api.get<FoodProps[]>('/foods').then(response => {
      setFoods(response.data)
    })
  }, [])

  console.log(foods)

  const handleAddFood = async (food: FoodProps) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true
      })

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }
  // handleAddFood = async food => {
  //   const { foods } = this.state

  //   try {
  //     const response = await api.post('/foods', {
  //       ...food,
  //       available: true
  //     })

  //     this.setState({ foods: [...foods, response.data] })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const handleUpdateFood = async (food: FoodProps) => {
    try {
      const foodUpdated = await api.put(`/foods/${food.id}`, {
        ...editingFood,
        ...foods
      })

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      )

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  }
  // handleUpdateFood = async food => {
  //   const { foods, editingFood } = this.state

  //   try {
  //     const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
  //       ...editingFood,
  //       ...food
  //     })

  //     const foodsUpdated = foods.map(f =>
  //       f.id !== foodUpdated.data.id ? f : foodUpdated.data
  //     )

  //     this.setState({ foods: foodsUpdated })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter(food => food.id !== id)

    setFoods(foodsFiltered)
  }

  // handleDeleteFood = async id => {
  //   const { foods } = this.state

  //   await api.delete(`/foods/${id}`)

  //   const foodsFiltered = foods.filter(food => food.id !== id)

  //   this.setState({ foods: foodsFiltered })
  // }

  const toggleModal = () => {
    setModalOpen(modalOpen => !modalOpen)
  }

  // toggleModal = () => {
  //   const { modalOpen } = this.state

  //   this.setState({ modalOpen: !modalOpen })
  // }

  const toggleEditModal = () => {
    setEditModalOpen(editModalOpen => !editModalOpen)
  }

  // toggleEditModal = () => {
  //   const { editModalOpen } = this.state

  //   this.setState({ editModalOpen: !editModalOpen })
  // }

  const handleEditFood = (food: FoodProps) => {
    setEditingFood({ editingFood: food, editModalOpen: true })
  }

  // handleEditFood = food => {
  //   this.setState({ editingFood: food, editModalOpen: true })
  // }

  // render() {
  //   const { modalOpen, editModalOpen, editingFood, foods } = this.state;

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={() => handleDeleteFood(food.id)}
              handleEditFood={() => handleEditFood(food)}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
